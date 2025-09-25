from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Request

# Simple user model in DB: { username, password_hash, roles }

router = APIRouter()

SECRET_KEY = "CHANGE_ME_SUPER_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    username: str
    password: str


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def get_user(request: Request, username: str) -> Optional[dict]:
    user = await request.app.mongodb.users.find_one({"username": username})
    return user


async def authenticate_user(request: Request, username: str, password: str) -> Optional[dict]:
    user = await get_user(request, username)
    if not user:
        return None
    if not verify_password(password, user.get("password_hash", "")):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", status_code=201)
async def register(user: UserCreate, request: Request):
    existing = await request.app.mongodb.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")
    password_hash = get_password_hash(user.password)
    doc = {"username": user.username, "password_hash": password_hash, "roles": ["user"], "created_at": datetime.utcnow()}
    await request.app.mongodb.users.insert_one(doc)
    return {"message": "User registered"}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None):
    user = await authenticate_user(request, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    token = create_access_token({"sub": user["username"], "roles": user.get("roles", [])})
    return Token(access_token=token)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"username": username, "roles": payload.get("roles", [])}
    except JWTError:
        raise credentials_exception


def require_auth(user: dict = Depends(get_current_user)):
    return user


