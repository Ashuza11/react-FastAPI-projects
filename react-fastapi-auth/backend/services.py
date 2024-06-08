import os
import jwt as _jwt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import dotenv as _dotenv
import fastapi as _fastapi
import fastapi.security as _security

import database as _database, models as _models, schemas as _schemas



_dotenv.load_dotenv()  
oauth2_schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

jwt_secret = os.getenv("JWT_SECRET")


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Ckeck if user exists in the database
async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()

# Create a new user
async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


# User authentication
async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email, db)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

# create Token
async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), jwt_secret)

    # return {"access_token": token, "token_type": "bearer"}
    return dict(access_token=token, token_type="bearer")


# Get the current user
async def get_current_user(
        db: _orm.Session = _fastapi.Depends(get_db), 
        token: str = _fastapi.Depends(oauth2_schema)
):
    try:
        payload = _jwt.decode(token, jwt_secret, algorithms=["HS256"])
        user = db.query(_models.User).get(payload.get("id"))
    except _jwt.PyJWTError:
        raise _fastapi.HTTPException(status_code=401, detail="Could not validate credentials")
    return _schemas.User.from_orm(user)

  

# Create Leads  function 
async def create_lead(
        user: _schemas.User, 
        db: _orm.Session,
        lead: _schemas.LeadCreate
    ):
    lead = _models.Lead(**lead.dict(), owner_id=user.id)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return _schemas.Lead.from_orm(lead)