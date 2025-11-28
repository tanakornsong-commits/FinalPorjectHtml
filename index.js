const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// สร้างการเชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'testdb'
});

// ตรวจสอบสถานะการเชื่อมต่อ
db.connect(err => {
    if (err) console.error('เชื่อมต่อ Database ไม่สำเร็จ:', err);
    else console.log('เชื่อมต่อ Database สำเร็จ');
});

// --- ส่วนจัดการข้อมูลนักวิ่ง (CRUD) ---

// ดึงข้อมูลรายชื่อนักวิ่งทั้งหมด
app.get('/api/runners', (req, res) => {
    // เรียงลำดับจากคนล่าสุดไปหาคนเก่าสุด
    db.query('SELECT * FROM runners ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// เพิ่มข้อมูลนักวิ่งใหม่
app.post('/api/runners', (req, res) => {
    const { name, distance, price } = req.body;
    // บันทึกข้อมูลลงตาราง
    db.query('INSERT INTO runners (name, distance, price) VALUES (?, ?, ?)', 
    [name, distance, price], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: 'บันทึกสำเร็จ' });
    });
});

// แก้ไขข้อมูลชื่อนักวิ่ง
app.put('/api/runners/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    // อัปเดตชื่อตาม ID ที่ระบุ
    db.query('UPDATE runners SET name=? WHERE id=?', [name, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: 'แก้ไขสำเร็จ' });
    });
});

// ลบข้อมูลนักวิ่ง
app.delete('/api/runners/:id', (req, res) => {
    const { id } = req.params;
    // ลบแถวตาม ID ที่ระบุ
    db.query('DELETE FROM runners WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: 'ลบสำเร็จ' });
    });
});

// --- ส่วนรายงานผล (Report) ---

// รายงาน 1: สรุปยอดรวมทั้งหมด (เงินและจำนวนคน)
app.get('/api/report/total', (req, res) => {
    db.query('SELECT SUM(price) as total_money, COUNT(*) as total_people FROM runners', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// รายงาน 2: สรุปยอดแยกตามประเภทระยะทาง
app.get('/api/report/breakdown', (req, res) => {
    // จัดกลุ่มตามระยะทาง (GROUP BY) เพื่อนับจำนวนและรวมเงินแต่ละรุ่น
    const sql = 'SELECT distance, COUNT(*) as qty, SUM(price) as total FROM runners GROUP BY distance ORDER BY price ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});