CREATE TABLE hotels(
    hotel_id SERIAL PRIMARY KEY,
    hotel_image_url TEXT NOT NULL, -- Store image URL or file path
    hotel_title VARCHAR(255) NOT NULL, -- Hotel name
    hotel_description TEXT, -- Hotel description
    hotel_latitude DECIMAL(9,6) NOT NULL, -- Precise latitude
    hotel_longitude DECIMAL(9,6) NOT NULL, -- Precise longitude
    hotel_price NUMERIC(10, 2) CHECK (hotel_price >= 0) NOT NULL, -- Price with validation
    hotel_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hotel_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
