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

CREATE INDEX idx_user_grad_year ON User(gradYear);
CREATE INDEX idx_user_major ON User(major);

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

CREATE INDEX idx_alumniwall_company ON AlumniWall(company);
CREATE INDEX idx_alumniwall_industry ON AlumniWall(industry);

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

CREATE INDEX idx_post_title ON Post(title);

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

CREATE INDEX idx_job_title ON JobPosting(title);

DELIMITER //

CREATE PROCEDURE PopulateInitialData()
BEGIN
    START TRANSACTION;

    IF (SELECT COUNT(*) FROM User) = 0 THEN
        INSERT INTO User (email, password, first, last, major, degree, gradMonth, gradYear, type, department, title)
        VALUES
        ('student1@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'John', 'Adams', 'Computer Science', 'MS', 12, 2028, 'student', NULL, NULL),
        ('student2@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Bob', 'Carter', 'Biology', 'BS', 12, 2025, 'student', NULL, NULL),
        ('student3@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Katie', 'Evans', 'Mathematics', 'PhD', 5, 2028, 'student', NULL, NULL),
        ('student4@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Elsa', 'Perez', 'Mechanical Engineering', 'BS', 12, 2025, 'student', NULL, NULL),
        ('student5@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Tiffany', 'Hill', 'Mathematics', 'PhD', 12, 2029, 'student', NULL, NULL),

        ('alumni1@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Joseph', 'Hill', 'Mathematics', 'BS', 5, 2023, 'alumni', NULL, NULL),
        ('alumni2@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Taylor', 'Walker', 'Computer Science', 'BS', 5, 2022, 'alumni', NULL, NULL),
        ('alumni3@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Eddie', 'Young', 'Biology', 'MS', 12, 2023, 'alumni', NULL, NULL),
        ('alumni4@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Alex', 'Adams', 'Electrical Engineering', 'PhD', 12, 2021, 'alumni', NULL, NULL),
        ('alumni5@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Casey', 'Lee', 'Civil Engineering', 'MS', 5, 2020, 'alumni', NULL, NULL),

        ('staff1@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Lebron', 'Green', 'Biology', 'PhD', 6, 1997, 'staff', 'Science', 'Professor'),
        ('staff2@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Mary', 'Jonhson', 'Civil Engineering', 'PhD', 6, 2004, 'staff', 'Engineering', 'Researcher'),
        ('staff3@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'David', 'Hall', 'Chemistry', 'BS', 6, 2005, 'staff', 'Humanities', 'Administrator'),
        ('staff4@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Riley', 'Adams', 'Physics', 'BS', 5, 1999, 'staff', 'Mathematics', 'Administrator'),
        ('staff5@sjsu.edu', '$2y$10$pNq5F5ZRyWwk6Ecb9lIYEuQrJ/7Co.mOYfQEzNXzC6nviSfkVpZdm', 'Emma', 'Walker', 'Biology', 'PhD', 5, 2005, 'staff', 'Science', 'Lab Assistant');
    END IF;

    IF (SELECT COUNT(*) FROM Connection) = 0 THEN
        INSERT INTO Connection (user1, user2) VALUES
        (1, 6),
        (6, 1),
        (1, 7),
        (1, 8),
        (1, 9),
        (2, 10),
        (2, 9),
        (2, 8),
        (3, 6),
        (4, 7),
        (7, 4);
    END IF;

    IF (SELECT COUNT(*) FROM AlumniWall) = 0 THEN
        INSERT INTO AlumniWall (user, company, industry) VALUES
        (6, 'Chase', 'Banking'),
        (7, 'Google', 'Technology'),
        (8, 'Pfizer', 'Biology');
    END IF;

    IF (SELECT COUNT(*) FROM AlumniContact) = 0 THEN
        INSERT INTO AlumniContact (user, url) VALUES
        (6, 'https://instagram.com/josephhill'),
        (6, 'https://linkedin.com/in/josephhill'),
        (7, 'https://x.com/taylorwalker'),
        (7, 'https://instagram.com/taylorwalker'),
        (7, 'https://linkedin.com/taylorwalker'),
        (7, 'https://github.com/taylorwalker'),
        (8, 'https://instagram.com/eddieyoung');
    END IF;

    IF (SELECT COUNT(*) FROM Post) = 0 THEN
        INSERT INTO Post (user, title, text) VALUES
        (2, 'My First Post', 'This is my first post!'),
        (1, 'Hello World', 'Excited to join this platform!'),
        (6, 'Party', 'Anyone want to attend a party this weekend?!'),
        (3, 'Dance', 'I am going to my favorite dance hall this weekend!'),
        (3, 'Job', 'Who else is trying to find a job?'),
        (8, 'Any Gamers?', 'Who wants to play League?'),
        (9, 'Job', 'I just got a job offer!'),
        (11, 'Feedback', 'Is everyone enjoying this app?'),
        (12, 'Maintenance', 'There will be maintenance for Spartan Outreach this weekend!'),
        (2, 'My Second Post', 'This is my second post!');
    END IF;

    IF (SELECT COUNT(*) FROM Media) = 0 THEN
        INSERT INTO Media (post, URL, type) VALUES
        (1, 'https://example.com/image1.jpg', 'photo'),
        (2, 'https://example.com/video1.mp4', 'video'),
        (5, 'https://example.com/gif1.mp4', 'url'),
        (7, 'https://example.com/image7.mp4', 'photo'),
        (7, 'https://example.com/video7.mp4', 'video'),
        (8, 'https://example.com/video8.mp4', 'video'),
        (10, 'https://example.com/image10.jpg', 'photo');
    END IF;

    IF (SELECT COUNT(*) FROM `Like`) = 0 THEN
        INSERT INTO `Like` (user, post) VALUES
        (1, 1),
        (2, 1),
        (3, 1),
        (4, 1),
        (5, 1),
        (6, 1),
        (1, 2),
        (1, 3),
        (1, 6),
        (1, 10),
        (2, 10),
        (3, 2),
        (3, 3),
        (4, 4),
        (6, 5),
        (7, 6);
    END IF;

    IF (SELECT COUNT(*) FROM Comment) = 0 THEN
        INSERT INTO Comment (user, post, comment) VALUES
        (1, 1, 'Welcome to the platform!'),
        (2, 2, 'Nice to see you here!'),
        (1, 4, 'I want to.'),
        (2, 4, 'Cant come...'),
        (10, 5, 'I am!'),
        (3, 6, 'Add me'),
        (6, 6, 'My username is explosion!'),
        (8, 6, 'Lets play!'),
        (1, 7, 'Congrats'),
        (5, 7, 'Niceeeee!'),
        (9, 7, 'Good job!'),
        (12, 8, 'Any feedback is appreciated!'),
        (1, 10, 'Hello again!');
    END IF;

    IF (SELECT COUNT(*) FROM Fundraiser) = 0 THEN
        INSERT INTO Fundraiser (creator, goal, description, ends, name) VALUES
        (11, 1234.00, 'Raising funds for an AI video surveillance camera.', '2024-12-2', 'AI Research'),
        (13, 2500.00, 'Raising funds for a better SRAC.', '2025-02-25', 'Gym'),
        (14, 750.00, 'Raising funds to provide food for the homeless!.', '2024-12-31', 'Food Drive');
    END IF;

    IF (SELECT COUNT(*) FROM Donation) = 0 THEN
        INSERT INTO Donation (fundraiser, user, amount) VALUES
        (1, 2, 120.00),
        (1, 5, 200.00),
        (2, 7, 5.00),
        (2, 8, 10.00),
        (2, 3, 25.00),
        (3, 1, 99.00),
        (1, 9, 75.00);
    END IF;

    IF (SELECT COUNT(*) FROM SocialEvent) = 0 THEN
        INSERT INTO SocialEvent (name, creator, timestamp, street, state, city, ZIP, description) VALUES
        ('Alumni Meetup', 12, '2024-12-01 18:00:00', '123 Sesame St', 'CA', 'San Jose', '12345', 'An event for alumni to reconnect.'),
        ('Homecoming Dance', 12, '2024-5-01 19:00:00', '7th St', 'CA', 'San Jose', '12345', 'Once a year dance for everyone!'),
        ('Board Meeting', 15, '2024-12-31 15:00:00', '21st Dorm St', 'CA', 'San Jose', '12345', 'Election for the next commiittee');

    END IF;

    IF (SELECT COUNT(*) FROM RSVP) = 0 THEN
        INSERT INTO RSVP (user, event) VALUES
        (6, 1),
        (9, 1),
        (2, 2),
        (3, 2),
        (12, 2),
        (5, 2),
        (11, 3),
        (12, 3),
        (13, 3);
    END IF;

    IF (SELECT COUNT(*) FROM JobPosting) = 0 THEN
        INSERT INTO JobPosting (creator, URL, description, title) VALUES
        (11, 'https://example.com/job1', 'Looking for a software engineer intern for summer 2025.', 'Software Engineer Intern'),
        (12, 'https://example.com/job2', 'Marketing manager position available.', 'Marketing Manager');
    END IF;

    COMMIT;
END//

DELIMITER ;

CALL PopulateInitialData();
