$(document).ready(function () {
    $(document).on("click", ".save-btn", saveEventDetails);
    setInterval(function () {
        renderTime();
        renderEventColorCode();
    }, 60000);
    $(document).on("keyup", ".event-block", changeSaveBtnColor);
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
            var currentTimeHour = parseInt(moment().format('h'));
            if (currentTimeHour != 12 && moment().format('a') == "pm") {
                currentTimeHour += 12;
            }
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
        const eventDetails = eventBlockEl.val().trim();
        const timeHour = eventBlockEl.attr("data-time");
        var foundIndex = -1;
        $.each(eventBlockDetails, function (index, item) {
            if (item.timeHour == timeHour) {
                foundIndex = index;
            }
        });
        if (-1 == foundIndex) {
            const eventTime = {};
            eventTime['timeHour'] = timeHour;
            eventTime['eventDetails'] = eventDetails;
            eventBlockDetails.push(eventTime);
        }
        else {
            eventBlockDetails[foundIndex].eventDetails = eventDetails;
        }

        localStorage.setItem("eventBlockDetails", JSON.stringify(eventBlockDetails));
        $(this).removeClass("need-save");
    }

    function renderEventDetails() {
        $.each(eventBlockDetails, function (index, item) {
            const timeHour = item.timeHour;
            $("#event-block-" + timeHour).val(item.eventDetails);
        });
    }

    function changeSaveBtnColor() {
        const saveNeeded = isSaveNeeded($(this).attr("data-time"), $(this).val());
        console.log(saveNeeded);
        if (saveNeeded) {
            $(this).parent()
                .children("div.input-group-append")
                .children("button")
                .addClass("need-save");
        }
        else {
            console.log("removing need-save class");
            $(this).parent()
                .children("div.input-group-append")
                .children("button")
                .removeClass("need-save");
        }

    }

    function isSaveNeeded(hourNumber, currentText) {
        console.log(currentText);
        var saveNeeded = false;
        $.each(eventBlockDetails, function (index, item) {
            if (hourNumber == item.timeHour) {
                console.log(item.eventDetails);
                if (currentText.trim() != item.eventDetails) {
                    console.log("Both are not same");
                    saveNeeded = true;
                }
                else {
                    console.log("Both are same");
                    saveNeeded = false;
                }
            }
        });
        if(currentText.trim().length >0)
        {
            saveNeeded = true;
        }
        return saveNeeded;
    }
});


