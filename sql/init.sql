
CREATE DATABASE IF NOT EXISTS hospital;

USE hospital;

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL
);

-- Sample doctor records for initial testing.
INSERT INTO doctors (name, specialization)
SELECT 'Dr. Ramesh', 'Cardiology'
WHERE NOT EXISTS (
    SELECT 1 FROM doctors WHERE name = 'Dr. Ramesh'
);

INSERT INTO doctors (name, specialization)
SELECT 'Dr. Suresh', 'Neurology'
WHERE NOT EXISTS (
    SELECT 1 FROM doctors WHERE name = 'Dr. Suresh'
);
