INSERT INTO department(name)
VALUES
    ('Human Resources'),
    ('Sales'),
    ('Accounting'),
    ('Media Relations');

INSERT INTO role(title, salary, department_id)
VALUES
    ('HR Assistant', 12100.23, 1),
    ('HR Leader', 15100.52, 1),
    ('Salesman', 2300.40, 2),
    ('Accountant', 23505.68, 3),
    ('Head Accountant', 28675.79, 3),
    ('Ambassador', 10783.16, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Leroy', 'Mayne', 2, NULL),
    ('Leroy', 'Jr.', 1, 1),
    ('Marcus', 'Linel', 3, NULL),
    ('Jodie', 'Shie', 4, 6),
    ('Brenda', 'Tells', 4, 6),
    ('Amy', 'Frensies', 5, NULL),
    ('Frank', 'Nopes', 6, NULL);
