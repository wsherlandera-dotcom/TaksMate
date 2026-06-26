let schedules =
JSON.parse(localStorage.getItem("schedules")) || [];

renderWeeklySchedule();

function addSchedule(){

    const course =
    document.getElementById("courseName")
    .value.trim();

    const day =
    document.getElementById("courseDay")
    .value;

    const start =
    document.getElementById("startTime")
    .value;

    const end =
    document.getElementById("endTime")
    .value;

    const room =
    document.getElementById("room")
    .value.trim();

    const lecturer =
    document.getElementById("lecturer")
    .value.trim();

    if(
        !course ||
        !start ||
        !end ||
        !room ||
        !lecturer
    ){
        alert("Lengkapi semua data!");
        return;
    }

    if(start >= end){
        alert(
            "Jam selesai harus lebih besar dari jam mulai!"
        );
        return;
    }

    schedules.push({

        id: Date.now(),

        course,
        day,
        start,
        end,
        room,
        lecturer

    });

    saveSchedule();

    renderWeeklySchedule();

    document.getElementById("courseName").value="";
    document.getElementById("startTime").value="";
    document.getElementById("endTime").value="";
    document.getElementById("room").value="";
    document.getElementById("lecturer").value="";
}

function renderWeeklySchedule(){

    const container =
    document.getElementById("weeklySchedule");

    if(!container) return;

    container.innerHTML="";

    const days = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const today =
    new Date();

    const currentDay =
    today.getDay();

    const monday =
    new Date(today);

    const diff =
    currentDay === 0
    ? -6
    : 1 - currentDay;

    monday.setDate(
        today.getDate() + diff
    );

    days.forEach((day,index)=>{

        const currentDate =
        new Date(monday);

        currentDate.setDate(
            monday.getDate() + index
        );

        const isToday =
        currentDate.toDateString() ===
        new Date().toDateString();

        const formattedDate =
        currentDate.toLocaleDateString(
            "id-ID",
            {
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

        const schedulesToday =
        schedules
        .filter(
            item =>
            item.day === day
        )
        .sort(
            (a,b)=>
            a.start.localeCompare(
                b.start
            )
        );

        let html = `
        <div class="week-card ${
            isToday ? "today-card" : ""
        }">

            <h3>${day}</h3>

            <p class="week-date">
                ${formattedDate}
            </p>
        `;

        if(
            schedulesToday.length === 0
        ){
            html += `
            <p class="empty-day">
                Tidak ada jadwal
            </p>
            `;
        }

        schedulesToday.forEach(item=>{

            html += `
            <div class="week-item">

                <strong>
                    📚 ${item.course}
                </strong>

                ⏰ ${item.start}
                - ${item.end}

                <br>

                🏫 ${item.room}

                <br>

                👨‍🏫 ${item.lecturer}

                <br><br>

                <button
                onclick="deleteSchedule(${item.id})">

                Hapus

                </button>

            </div>
            `;
        });

        html += `
        </div>
        `;

        container.innerHTML += html;

    });

}

function deleteSchedule(id){

    if(
        !confirm(
            "Hapus jadwal ini?"
        )
    ) return;

    schedules =
    schedules.filter(
        item =>
        item.id !== id
    );

    saveSchedule();

    renderWeeklySchedule();
}

function saveSchedule(){

    localStorage.setItem(
        "schedules",
        JSON.stringify(schedules)
    );

}