import React, {useState, useEffect} from "react"
import api from "../api"



const FormData = () => {
    const [transanctions, setTransactions] = useState([])
    
    const [formData, setFormData] = useState({
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: ''
    });
  
    const fetchTransactions = async () => {
      const response = await api.get ('/transactions/');
      setTransactions(response.data);

    }
    useEffect(() => {
        fetchTransactions();
    }, []);
  
    const handleImputChange = (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setFormData({
        ...formData,
        [event.target.name]: value
      });
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      await api.post('/transactions/', formData);
      fetchTransactions();
      setFormData({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
      });
    }

    return (
        <section className='bg-indigo-50'>
            <div className='container m-auto max-w-2xl py-24'>
                <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
                    <form onSubmit={handleFormSubmit}>
                        <h2 className='text-3xl text-center font-semibold mb-6'>Add Transaction</h2>

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>
                                Amount
                            </label>
                            <input
                                type='text'
                                id='amount'
                                name='amount'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='eg. $200000'
                                required
                                value={formData.amount}
                                onChange={handleImputChange}
                            />
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>
                                Category
                            </label>
                            <input
                                type='text'
                                id='category'
                                name='category'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='eg. school payments'
                                required
                                value={formData.category}
                                onChange={handleImputChange}
                            />
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-bold mb-2'>
                                Description
                            </label>
                            <input
                                type='text'
                                id='description'
                                name='description'
                                className='border rounded w-full py-2 px-3 mb-2'
                                placeholder='eg. Transaction description'
                                required
                                value={formData.description}
                                onChange={handleImputChange}
                            />
                        </div>

                        <div className='mb-4'>
                            <div className="ml-4 flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="is_income" 
                                    name="is_income" 
                                    checked={formData.is_income} 
                                    onChange={handleImputChange}
                                />
                                <label htmlFor="checkbox" className="pl-3 pr-4  text-left">
                                    <span className="block text-gray-700 font-bold"> Income? </span>
                                </label>
                            </div>
                        </div>

                        <div className='mb-4'>
                            <label htmlFor="date" className='block text-gray-700 font-bold mb-2'>
                                Date 
                            </label>
                            <input
                                type='text'
                                id='date'
                                name='date'
                                className='border rounded w-full py-2 px-3 mb-2'
                                value={formData.date}
                                onChange={handleImputChange}
                            />
                        </div>

                        <div>
                            <button
                                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                                type='submit'
                            >
                                Add Transaction
                            </button>
                        </div>
                    </form>

                    <h1 className="text-2xl font-bold text-center py-8">Transactions</h1>
                    <table className="mx-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Income</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transanctions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td className="border px-4 py-2">{transaction.amount}</td>
                                    <td className="border px-4 py-2">{transaction.category}</td>
                                    <td className="border px-4 py-2">{transaction.description}</td>
                                    <td className="border px-4 py-2">{transaction.is_income ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </section>
    )
} 

export default FormData
