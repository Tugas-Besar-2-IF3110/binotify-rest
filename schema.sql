USE habede_rest;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    username VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE song (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    Judul VARCHAR(64) NOT NULL,
    penyanyi_id INT NOT NULL,
    Audio_path VARCHAR(256) NOT NULL,
    FOREIGN KEY (penyanyi_id) REFERENCES user (user_id) ON DELETE CASCADE
);