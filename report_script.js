async function loadReports() {
    try {
        // 1. ดึงข้อมูลยอดรวม (Total Report)
        const resTotal = await fetch('/api/report/total');
        const dataTotal = await resTotal.json();
        
        // แสดงผลตัวเลขพร้อมใส่ลูกน้ำ (Comma)
        document.getElementById('totalMoney').innerText = (dataTotal.total_money || 0).toLocaleString();
        document.getElementById('totalPeople').innerText = (dataTotal.total_people || 0).toLocaleString();

        // 2. ดึงข้อมูลแยกประเภท (Breakdown Report)
        const resBreakdown = await fetch('/api/report/breakdown');
        const dataBreakdown = await resBreakdown.json();
        
        const tbody = document.getElementById('breakdownTable');
        tbody.innerHTML = '';

        if (dataBreakdown.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">ยังไม่มีข้อมูล</td></tr>';
            return;
        }

        // วนลูปสร้างแถวตารางสรุป
        dataBreakdown.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold text-primary">${item.distance}</td>
                <td><span class="badge bg-secondary fs-6">${item.qty} คน</span></td>
                <td class="fw-bold text-success">${(item.total || 0).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการโหลดรายงาน:", err);
    }
}

// เริ่มโหลดข้อมูลทันที
loadReports();