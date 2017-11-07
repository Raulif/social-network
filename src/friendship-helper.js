const getNextAction = function(userIsSender, currentStatus) {
    if(currentStatus == 'pending' && userIsSender) {
        return 'Cancel Friendship'
    }
    else if(currentStatus == 'pending' && !userIsSender) {
        return 'Accept Friendship'
    }
    else if(currentStatus == 'accepted') {
        return 'Terminate Friendship'
    }
    else {
        return 'Request Friendship'
    }
}

const getNextStatus = function(nextAction){
    if(nextAction == 'Cancel Friendship') {
        return 'cancelled'
    }
    else if(nextAction == 'Accept Friendship') {
        return 'accepted'
    }
    else if(nextAction == 'Terminate Friendship') {
        return 'terminated'
    }
    else if(nextAction == 'Reject Friendship') {
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
