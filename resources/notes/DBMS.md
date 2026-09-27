# DBMS — Exam-Ready Notes

## 1. ER Model
An Entity–Relationship model represents real-world objects and their relationships. An entity is an identifiable object such as Student or Course. Attributes describe entities, e.g. Roll No, Name and Marks. A relationship shows association between entities, e.g. Student ENROLLS in Course. Common cardinalities are 1:1, 1:N and M:N. ER diagrams use rectangles for entities, ovals for attributes and diamonds for relationships.

## 2. Relational Model
Data is stored in relations (tables). A row is a tuple and a column is an attribute. A domain defines allowed values. A primary key uniquely identifies tuples; a foreign key references a key in another table. Relational algebra operations include selection, projection, union, difference, Cartesian product and join.

## 3. SQL
DDL defines structure: CREATE, ALTER, DROP. DML changes data: INSERT, UPDATE, DELETE. DQL retrieves data using SELECT. DCL controls privileges: GRANT and REVOKE. TCL manages transactions: COMMIT, ROLLBACK and SAVEPOINT. Example: SELECT name FROM Student WHERE marks >= 60;

## 4. Normalization
Normalization reduces redundancy and update anomalies. 1NF requires atomic values. 2NF requires 1NF and removal of partial dependency on a composite key. 3NF requires 2NF and removal of transitive dependency. BCNF requires every determinant to be a candidate key. Advantages include better consistency and easier maintenance.

## 5. Transactions
A transaction is a logical unit of database work. ACID means Atomicity, Consistency, Isolation and Durability. COMMIT makes changes permanent; ROLLBACK undoes uncommitted changes. Concurrency control prevents problems such as lost update and dirty read. Serializability helps ensure concurrent execution is equivalent to a correct serial order.

### Important exam questions
1. Explain ER model with diagram and cardinality.
2. Differentiate primary key and foreign key.
3. Explain SQL command categories with examples.
4. Explain 1NF, 2NF and 3NF with examples.
5. Explain ACID properties and transaction states.
