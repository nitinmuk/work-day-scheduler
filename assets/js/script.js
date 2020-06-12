$(document).ready(function () {
    // event listerner which will trigger save event handler whenever user click
    //on save button.
    $(document).on("click", ".save-btn", saveEventDetails);
    // need to refresh time and hour color code after each minute so that correct color
    // code is visible and updated time is visible.
    setInterval(function () {
        renderTime();
        renderEventColorCode();
    }, 60000);
    //register a handler to change color of corresponding save button if save needed
    //whenever user clicks some key in any event block.
    $(document).on("keyup", ".event-block", changeSaveBtnColor);
    renderTime();
    renderEventColorCode();
    // create an empty array to maintain each event block details and persist
    // same in local storage.
    var eventBlockDetails = [];
    initEventBlocks();
    renderEventDetails();

    /**
     * based on current time, changes the background color of each event block
     * hour.
     */
    function renderEventColorCode() {
        $.each($(".event-block"), function (index, item) {
            const blockHour = parseInt($(item).attr("data-time"));
            var currentTimeHour = parseInt(moment().format('h'));
            if (12 != currentTimeHour && "pm" == moment().format('a')) {
                currentTimeHour += 12;
            }
            else if (12 == currentTimeHour && "am" == moment().format('a')) {
                currentTimeHour = 0;
            }
            if (blockHour == currentTimeHour) {
                resetTimeClass(item, "present");
            }
            else if (blockHour < currentTimeHour) {
                resetTimeClass(item, "past");
            }
            else {
                resetTimeClass(item, "future");
            }
        });
    }

    /**
     * reset class which controls the background color of the item
     * @param {*} item event detail block whose color need to be updated.
     * @param {*} currentClass class which need to be added to item.
     */
    function resetTimeClass(item, currentClass) {
        $(item).removeClass("present");
        $(item).removeClass("past");
        $(item).removeClass("future");
        $(item).addClass(currentClass);
    }

    /**
     * initializes the eventBlockDetails array from local storage.
     */
    function initEventBlocks() {
        const storedEventBlocks = localStorage.getItem("eventBlockDetails");
        if (storedEventBlocks && storedEventBlocks.length) {
            eventBlockDetails = JSON.parse(storedEventBlocks);
        }
    }

    /**
     * renders current day, date and time
     */
    function renderTime() {
        $("#current-date").text(moment().format('dddd, Do MMMM YYYY, h:mm a'));
    }

    /**
     * event handler function triggerred by click on save button
     * to save event details in local storage. It either creates new entry or
     * updates exisiting entry of evenBlockDetails array.
     */
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

    /**
     * iterates over eventBlockDetails array and renders saved text in correspnding
     * event block based on time hour.
     */
    function renderEventDetails() {
        $.each(eventBlockDetails, function (index, item) {
            const timeHour = item.timeHour;
            $("#event-block-" + timeHour).val(item.eventDetails);
        });
    }
    /**
     * changes save button colour if user has entered some text in corresponding input block
     * and if save need to be pressed to save the updated information for that block.
     */
    function changeSaveBtnColor() {
        const saveNeeded = isSaveNeeded($(this).attr("data-time"), $(this).val());
        const saveBtn = $(this).parent()
            .children("div.input-group-append")
            .children("button");
        if (saveNeeded) {
            saveBtn.addClass("need-save");
        }
        else {
            saveBtn.removeClass("need-save");
        }

    }

    /**
     * determined if save needed for current event block
     * @param {*} hourNumber current block hour number
     * @param {*} currentText current text present in event block
     */
    function isSaveNeeded(hourNumber, currentText) {
        var saveNeeded = false;
        $.each(eventBlockDetails, function (index, item) {
            if (hourNumber == item.timeHour) {
                if (currentText.trim() != item.eventDetails) {
                    saveNeeded = true;
                }
                else {
                    saveNeeded = false;
                }
            }
        });
        if (currentText.trim().length > 0) {
            saveNeeded = true;
        }
        return saveNeeded;
    }
});


