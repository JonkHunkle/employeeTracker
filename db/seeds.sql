INSERT INTO department (name)
VALUES ("Front End"),
       ("Back End"),
       ("Development");
       
INSERT INTO role (title, salary, department_ID)
VALUES ("President", "150000", 1),
       ("Tester", "70000", 3),
       ("Coder", "50000", 1);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Johnny", "Depp", 1, null),
       ("Bob", "Loblaw", 2, 1),
       ("Gunther", "The Penguin", 3, 1);