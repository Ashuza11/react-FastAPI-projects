import datetime as dt

import pydantic as _pydantic

# User Schema
class _UserBase(_pydantic.BaseModel):
    email: str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

class User(_UserBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

# Lead Schema
class _LeadBase(_pydantic.BaseModel):
    first_name: str
    last_name: str
    email: str
    company: str
    note: str
    class Config:
        from_attributes = True

class LeadCreate(_LeadBase):
    pass


class Lead(_LeadBase):
    id: int
    owner_id: int
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        orm_mode = True