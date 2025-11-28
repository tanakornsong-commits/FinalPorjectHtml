const API_URL = '/api/runners';

// ฟังก์ชันคำนวณราคาอัตโนมัติเมื่อมีการเปลี่ยนระยะทาง
document.getElementById('distance').addEventListener('change', function() {
    const dist = this.value;
    let money = 0;
    
    // กำหนดราคาตามเงื่อนไขระยะทาง
    if (dist === '5KM') money = 500;
    else if (dist === '10KM') money = 700;
    else if (dist === '21KM') money = 900;
    
    // แสดงผลราคาในช่อง input
    document.getElementById('price').value = money;
});

// ฟังก์ชันโหลดรายชื่อนักวิ่งมาแสดงในตาราง
async function loadRunners() {
    // ดึงข้อมูลจาก API
    const res = await fetch(API_URL);
    const data = await res.json();
    const tbody = document.querySelector('#runnerTable tbody');
    tbody.innerHTML = ''; // ล้างข้อมูลเก่า

    // วนลูปสร้างแถวในตาราง
    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><input value="${p.name}" class="form-control nameEdit" data-id="${p.id}"></td>
            <td>${p.distance}</td>
            <td>${p.price}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="updateRunner(${p.id})">แก้ไขชื่อ</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRunner(${p.id})">ลบ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ฟังก์ชันบันทึกข้อมูล (Insert)
async function addRunner() {
    const name = document.getElementById('name').value;
    const distance = document.getElementById('distance').value;
    const price = document.getElementById('price').value;

    if (!name || price == 0) return alert('กรุณากรอกข้อมูลให้ครบ!');

    // ส่งข้อมูลไปบันทึกที่ Server (Method: POST)
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, distance, price })
    });

    // เคลียร์ค่าในฟอร์มและโหลดตารางใหม่
    document.getElementById('name').value = '';
    document.getElementById('distance').value = '0';
    document.getElementById('price').value = '';
    loadRunners();
}

// ฟังก์ชันแก้ไขข้อมูล (Update)
async function updateRunner(id) {
    // ดึงค่าชื่อใหม่จากช่อง input
    const newName = document.querySelector(`.nameEdit[data-id="${id}"]`).value;
    // ส่งข้อมูลไปอัปเดตที่ Server (Method: PUT)
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    });
    alert('แก้ไขเรียบร้อย!');
    loadRunners();
}

// ฟังก์ชันลบข้อมูล (Delete)
async function deleteRunner(id) {
    if(!confirm('ยืนยันลบข้อมูล?')) return;
    // ส่งคำสั่งลบไปที่ Server (Method: DELETE)
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadRunners();
}

// เริ่มทำงานเมื่อเปิดหน้าเว็บ
loadRunners();