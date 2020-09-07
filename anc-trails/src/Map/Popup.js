
export const popupStyle = (track) => {

    const date = new Date(track.start_date);
    const distance = track.distance / 1609.344;
    const roundDistance = Math.round(distance * 100) / 100;
    const popup = "<b>" + date.getFullYear() + " Track</b><br><b>" + track.name + "</b><br><b>Miles: " + roundDistance + "</b>";

    return(
        popup
    )
}