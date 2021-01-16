# Employee Tracker
A console base node program to help employers track employees.

---
## 📌 LINKS
[GitHub Repo](https://github.com/ToMakPo/UWCB-12-Employee_Tracker)<br>
[Project Demo](https://tomakpo.github.io/UWCB-12-Employee_Tracker/)

---
## 🎯 GOAL
To create a node program that can help a complany track its employees.

--- 
## 👨🏻‍💼 User Story
**AS A** business owner<br>
**I WANT** to be able to view and manage the departments, roles, and employees in my company<br>
**SO THAT** I can organize and plan my business

---
## ✅ TASKS
- When this program starts, it should show the user a welcome screen and provide a list of actions for the user to select from. The user should be able to perform the following actions:
    - Add departments, roles, and employees
    - View departments, roles, and employees by department or manager or a full list of all
    - Delete departments, roles, and employees
    - Update department name
    - Update role title and salary
    - Update employee name, title, and manager
- The information for this should be stored in a database.

---
## 🧠 Database Schema
```
     ╔═ EMPLOYEE ══════════════════╗
  ┌─►║ id          INT AI       PK ║
  │  ║ first_name  VARCHAR(30)     ║
  │  ║ last_name   VARCHAR(30)     ║
  │  ║ role_id     INT          FK ╟──┐
  └──╢ manager_id  INT          FK ║  │
     ╚═════════════════════════════╝  │   ╔═ ROLE ══════════════════════╗
                                      └──►║ id          INT AI       PK ║
                                          ║ title       VARCHAR(30)     ║
     ╔═ DEPARTMENT ════════════════╗      ║ salary      INT             ║
     ║ id          INT AI       PK ║◄─────╢ role_id     INT          FK ║
     ║ name        VARCHAR(30)     ║      ╚═════════════════════════════╝
     ╚═════════════════════════════╝
```

---
## 🛠️ Toolbox
- Node.js
- MySQL
- Inquirer