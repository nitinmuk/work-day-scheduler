$(document).ready(function () {
    $(document).on("click", ".save-block", saveEventDetails);
    setInterval(function () {
        renderTime();
        renderEventColorCode();
    }, 60000);
    renderTime();
    renderEventColorCode();
    var eventBlockDetails = [];
    initEventBlocks();
    renderEventDetails();

    function renderEventColorCode() {
        $.each($(".event-block"), function (index, item) {
            //console.log(item);
            const blockHour = parseInt($(item).attr("data-time"));
            // console.log(typeof(blockHour));
            const currentTimeHour = parseInt(moment().format('h'));
            if (blockHour === currentTimeHour) {
                resetTimeClass(item, "present");
            }
            else if (blockHour < currentTimeHour) {
                resetTimeClass(item, "past");
            }
            else {
                resetTimeClass(item, "future");
            }
            // console.log(currentTimeHour);
            //console.log(typeof(currentTimeHour));
        });
    }

    function resetTimeClass(item, currentClass) {
        $(item).removeClass("present");
        $(item).removeClass("past");
        $(item).removeClass("future");
        $(item).addClass(currentClass);
    }

    function initEventBlocks() {
        const storedEventBlocks = localStorage.getItem("eventBlockDetails");
        if (storedEventBlocks && storedEventBlocks.length) {
            eventBlockDetails = JSON.parse(storedEventBlocks);
        }
    }

    function renderTime() {
        $("#current-date").text(moment().format('dddd, Do MMMM YYYY, h:mm a'));
    }

    function saveEventDetails() {
        const eventBlockEl = $(this).parent().parent().children("textarea")
        const eventDetails = eventBlockEl.val();
        const timeHour = eventBlockEl.attr("data-time");
        const eventTime = {};
        eventTime['timeHour'] = timeHour;
        eventTime['eventDetails'] = eventDetails;
        eventBlockDetails.push(eventTime);
        localStorage.setItem("eventBlockDetails", JSON.stringify(eventBlockDetails));
    }

    function renderEventDetails() {
        $.each(eventBlockDetails, function (index, item) {
            const timeHour = item.timeHour;
            $("#event-block-" + timeHour).val(item.eventDetails);
        });
    }
});


