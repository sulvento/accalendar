import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


function calendar(){
    // const handleDateClick = (arg) => {
    //     alert(arg.dateStr)
    // }
    return (
        <div>
            <Fullcalendar

            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
                start:"today prev,next",
                center: "title",
                end: "dayGridMonth, timeGridWeek, timeGridDay",
            }}

            // weekends={false} removes both weekend days
            // dateClick={handleDateClick}
            // eventContent={renderEventContent}


            
            />   
        </div>
    );
}

// function renderEventContent(eventInfo) {
//   return(
//     <>
//       <b>{eventInfo.timeText}</b>
//       <i>{eventInfo.event.title}</i>
//     </>
//   );
// }

export default calendar;