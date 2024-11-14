FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Django project files to the container
COPY . .

# Expose the port that Django will run on
EXPOSE 8000