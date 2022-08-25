const toTimestamp = (date) => {
    // Hours part from the timestamp
    var hours = '' + date.getHours();
    // Minutes part from the timestamp
    var minutes = '' + date.getMinutes();

    if (minutes.length === 1)
        minutes = "0" + minutes;


    // Will display time
    var formattedTime = hours + ':' + minutes;
    return formattedTime;
}

export { toTimestamp };