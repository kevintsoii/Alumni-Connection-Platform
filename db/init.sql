CREATE TABLE IF NOT EXISTS User (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    major VARCHAR(100),
    degree VARCHAR(100),
    gradMonth INT,
    gradYear INT NOT NULL,
    type ENUM('student', 'alumni', 'staff') NOT NULL DEFAULT 'student',
    department VARCHAR(100),
    title VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Connection (
    user1 INT,
    user2 INT,
    PRIMARY KEY (user1, user2),
    FOREIGN KEY (user1) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (user2) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AlumniWall (
    user INT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AlumniContact (
    user INT,
    url VARCHAR(255),
    PRIMARY KEY (user, url),
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Post (
    postID INT PRIMARY KEY AUTO_INCREMENT,
    user INT  NOT NULL,
    title VARCHAR(255)  NOT NULL,
    text TEXT,
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Media (
    post INT,
    URL VARCHAR(255),
    type ENUM('url', 'photo', 'video') NOT NULL DEFAULT 'url',
    PRIMARY KEY (post, URL),
    FOREIGN KEY (post) REFERENCES Post(postID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Like` (
    user INT NOT NULL,
    post INT NOT NULL,
    PRIMARY KEY (user, post),
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (post) REFERENCES Post(postID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
    commentID INT PRIMARY KEY AUTO_INCREMENT,
    user INT NOT NULL,
    post INT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (post) REFERENCES Post(postID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Fundraiser (
    fundraiserID INT PRIMARY KEY AUTO_INCREMENT,
    creator INT NOT NULL,
    goal DECIMAL(10, 2),
    description TEXT,
    ends DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (creator) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Donation (
    donationID INT PRIMARY KEY AUTO_INCREMENT,
    fundraiser INT NOT NULL,
    user INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (fundraiser) REFERENCES Fundraiser(fundraiserID) ON DELETE CASCADE,
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SocialEvent (
    eventID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    creator INT NOT NULL,
    timestamp DATETIME NOT NULL,
    street VARCHAR(255),
    state VARCHAR(50),
    city VARCHAR(100),
    ZIP VARCHAR(10),
    description TEXT,
    FOREIGN KEY (creator) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RSVP (
    user INT NOT NULL,
    event INT NOT NULL,
    PRIMARY KEY (user, event),
    FOREIGN KEY (user) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (event) REFERENCES SocialEvent(eventID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS JobPosting (
    jobID INT PRIMARY KEY AUTO_INCREMENT,
    creator INT NOT NULL,
    URL VARCHAR(255) NOT NULL,
    description TEXT,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (creator) REFERENCES User(userID) ON DELETE CASCADE
);

DELIMITER //

CREATE PROCEDURE PopulateInitialData()
BEGIN
    START TRANSACTION;

    IF (SELECT COUNT(*) FROM User) = 0 THEN
        INSERT INTO User (email, password, first, last, major, degree, gradMonth, gradYear, type, department, title)
        VALUES
        ('student@sjsu.edu', 'password1', 'John', 'Doe', 'Computer Science', 'BS', 5, 2027, 'student', NULL, NULL),
        ('alumni@sjsu.edu', 'password2', 'Alice', 'Smith', 'Economics', 'MS', 5, 2023, 'alumni', NULL, NULL),
        ('staff@sjsu.edu', 'password3', 'Bob', 'Jones', 'Mathematics', 'PhD', 6, 2005, 'staff', 'Science', 'Researcher');
    END IF;

    IF (SELECT COUNT(*) FROM Connection) = 0 THEN
        INSERT INTO Connection (user1, user2) VALUES
        (1, 2),
        (2, 1),
        (2, 3);
    END IF;

    IF (SELECT COUNT(*) FROM AlumniWall) = 0 THEN
        INSERT INTO AlumniWall (user, company, industry) VALUES
        (2, 'Apple', 'Technology');
    END IF;

    IF (SELECT COUNT(*) FROM AlumniContact) = 0 THEN
        INSERT INTO AlumniContact (user, url) VALUES
        (2, 'https://linkedin.com/in/alicesmith'),
        (2, 'https://instagram.com/alicesmith');
    END IF;

    IF (SELECT COUNT(*) FROM Post) = 0 THEN
        INSERT INTO Post (user, title, text) VALUES
        (2, 'My First Post', 'This is my first post!'),
        (1, 'Hello World', 'Excited to join this platform!');
    END IF;

    IF (SELECT COUNT(*) FROM Media) = 0 THEN
        INSERT INTO Media (post, URL, type) VALUES
        (1, 'https://example.com/image1.jpg', 'photo'),
        (2, 'https://example.com/video1.mp4', 'video');
    END IF;

    IF (SELECT COUNT(*) FROM `Like`) = 0 THEN
        INSERT INTO `Like` (user, post) VALUES
        (1, 1),
        (2, 2);
    END IF;

    IF (SELECT COUNT(*) FROM Comment) = 0 THEN
        INSERT INTO Comment (user, post, comment) VALUES
        (1, 2, 'Welcome to the platform!'),
        (2, 1, 'Great first post!');
    END IF;

    IF (SELECT COUNT(*) FROM Fundraiser) = 0 THEN
        INSERT INTO Fundraiser (creator, goal, description, ends, name) VALUES
        (3, 1234.00, 'Raising funds for an AI video surveillance camera.', '2024-12-31', 'AI Research');
    END IF;

    IF (SELECT COUNT(*) FROM Donation) = 0 THEN
        INSERT INTO Donation (fundraiser, user, amount) VALUES
        (1, 2, 50.00),
        (1, 3, 75.00);
    END IF;

    IF (SELECT COUNT(*) FROM SocialEvent) = 0 THEN
        INSERT INTO SocialEvent (name, creator, timestamp, street, state, city, ZIP, description) VALUES
        ('Alumni Meetup', 3, '2024-12-01 18:00:00', '123 Sesame St', 'CA', 'San Jose', '12345', 'An event for alumni to reconnect.');
    END IF;

    IF (SELECT COUNT(*) FROM RSVP) = 0 THEN
        INSERT INTO RSVP (user, event) VALUES
        (2, 1);
    END IF;

    IF (SELECT COUNT(*) FROM JobPosting) = 0 THEN
        INSERT INTO JobPosting (creator, URL, description, title) VALUES
        (3, 'https://example.com/job1', 'Looking for a software engineer intern for summer 2025.', 'Software Engineer Intern'),
        (2, 'https://example.com/job2', 'Marketing manager position available.', 'Marketing Manager');
    END IF;

    COMMIT;
END//

DELIMITER ;

CALL PopulateInitialData();
