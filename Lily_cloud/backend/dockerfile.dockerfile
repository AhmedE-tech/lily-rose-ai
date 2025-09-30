# Lily-Cloud/backend/Dockerfile
FROM python:3.11-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache gcc musl-dev linux-headers

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
