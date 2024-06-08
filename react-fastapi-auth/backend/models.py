import datetime as dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database

class User(_database.Base):
    __tablename__ = "users"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    username = _sql.Column(_sql.String, unique=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)

    leads = _orm.relationship("Lead", back_populates="owner")



    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
    

class Lead(_database.Base):
    __tablename__ = "leads"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    first_name = _sql.Column(_sql.String, index=True)
    last_name = _sql.Column(_sql.String, index=True)
    email = _sql.Column(_sql.String, index=True)
    company = _sql.Column(_sql.String, index=True, default="")
    note = _sql.Column(_sql.String, index=True, default="")
    created_at = _sql.Column(_sql.DateTime, default=dt.datetime.now)
    updated_at = _sql.Column(_sql.DateTime, default=dt.datetime.now)

    owner = _orm.relationship("User", back_populates="leads")