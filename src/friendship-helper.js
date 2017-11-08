const getNextAction = function(userIsSender, currentStatus) {
    if(currentStatus === 'pending' && userIsSender) {
        return 'Cancel Request'
    }
    else if(currentStatus === 'pending' && !userIsSender) {
        return 'Accept Request'
    }
    else if(currentStatus === 'accepted') {
        return 'Terminate Friendship'
    }
    else {
        return 'Request Friendship'
    }
}

const getNextStatus = function(currentNextAction){
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
