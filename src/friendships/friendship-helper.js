const getNextAction = function(userIsSender, currentStatus) {
    /*We set the action which will be triggered by the friendship button (aka the
    'nextAction') according to the current state of the friendship between the user
    and the other user (underneath which the button is being displayed).
    The nextAction will be as well the HTML value of the friendship button*/
    if(currentStatus === 'pending' && userIsSender) {
        //a friendship not yet confirmed can be cancelled if the user == sender
        return 'Cancel Request'
    }
    else if(currentStatus === 'pending' && !userIsSender) {
        //a friendship not yet confirmed can be accepted if the user != sender
        return 'Accept Request'
    }
    else if(currentStatus === 'accepted') {
        //a confirmed friendship can be terminated
        return 'Terminate Friendship'
    }
    else {
        /*the only remaining case is that there is no current friendship between
        the user and the other user*/
        return 'Request Friendship'
    }
}

const getNextStatus = function(currentNextAction){
    /*We set the status of the frienship in the db according to the action triggered
    by the friendship button. An action which has already been declared by the
    getNextAction function becomes the 'currentNextAction'. It equals the HTML
    value of the friendship button.*/
    if(currentNextAction === 'Cancel Request') {
        return 'cancelled'
    }
    else if(currentNextAction === 'Accept Request') {
        return 'accepted'
    }
    else if(currentNextAction === 'Terminate Friendship') {
        return 'terminated'
    }
    else if(currentNextAction === 'Reject Friendship') {
        return 'rejected'
    }
    else {
        return 'pending'
    }
}

module.exports = {
    getNextAction: getNextAction,
    getNextStatus: getNextStatus
}
