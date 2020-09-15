
export const popupStyle = (track) => {

    const date = new Date(track.start_date);
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' })
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date); 
    const distance = track.distance / 1609.344;
    const roundDistance = Math.round(distance * 100) / 100;
    const timeHours = Math.floor(track.moving_time / 3600);
    const timeMinutes = (track.moving_time % 3600) / 1200;
    const timeMinutesRound = Math.floor(timeMinutes);

    return(
        "<div class='popup-container'>" +
            "<div class='popup-title'>"
                + track.name +
            "</div>" +
            "<div class='popup-detail'>" +
                "<div class='item'>" +
                    "<div class='item-label'>" +
                    "Miles" +
                    "</div>" +
                    "<div class='item-data'>" +
                    roundDistance +
                    "</div>" +
                "</div>" +
                "<div class='separator'></div>" +
                "<div class='item'>" +
                    "<div class='item-label'>" +
                    "Time" +
                    "</div>" +
                    "<div class='item-data'>" +
                    timeHours + "h " + timeMinutesRound + "m" +
                    "</div>" +
                "</div>" +
                "<div class='separator'></div>" +
                "<div class='item'>" +
                    "<div class='item-label'>" +
                    "Achievements" +
                    "</div>" +
                    "<div class='item-data'>" +
                    track.achievement_count +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</div>"

    )
}