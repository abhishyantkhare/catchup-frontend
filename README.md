Catchup Design Doc
===

This document attempts to capture my thoughts and notes while building Catchup. I want to have a solid design down before I start coding immediately. Taking 162 really taught me the value of having a well thought out design beforehand, and this can probably save me a lot of trouble. In the past I usually dive in without a second thought, but this strategy forsakes long term progress for short term gain. If I want to make something that is more than a series of commits for two days on Github, I need to think about a good foundation.

Is this overkill for a side project? Probably, but it's never a bad idea to practice careful planning and design. Even if this will be seen only by me, it's good to hold yourself to a higher standard. Taking the five minutes to think through something can save hours of coding and a much better design.



## What is Catchup?
There's multiple parts to this answer, so let's break it down:
* **The Mission**: To enable people to lead the rich social lives that they are capable of
* **The Problem**: There is too much bullshit that stops people from socializing with their close ones, whether it be a significant other or a good friend. Here's a few:
    * Personal Intertia: It takes "too much energy" to put in the effort of finding something to do and scheduling it
    * Lack of Ideas: Once you've decided to do something, you can't think of a good idea. Once in a while a spark comes to you, but most of the time you fall back on dinner at Thai Noodle 2 or playing BP in your apartment.
    * Scheduling Conflicts: You've found something cool to do, or maybe have decided on Thai Noodle 2. Now you have to find a time that works for both of you. Let the scheduling dance begin. You suggest a time and day, and two days later they respond saying that doesn't work and suggest an alternative time and day 3 days later. Now when they finally respond to that, the time for the event has long since passed.
    * Falling Out of Touch: Go through the rigamarole of the above process with someone enough times, and if you're not in the same class or activity, you eventually stop talking. Without any disagreement or animosity, a once close friendship falls apart. This is really a sad result and something that can be easily avoided, hopefully through the use of catchup. 
* **Catchup's Solution**:  I'm going to start by creating a simple service. It schedules (default weekly but you can change the frequency if you're not THAT close) events by first picking an event idea, such as dinner, hiking, berry picking, ice skating etc, and then finds a free time for both of you and schedules the event on your Google calendars. So now that scheduling interesting hangouts is a lot easier, hopefully the fourth problem gets alleviated as well. I definitely think that this won't solve the problem entirely, but a prototype is just that, a prototype. I want this to be a proof of concept, that this problem exists and that there are solutions. At the very least my roommates and I can finally do more fun things than drinking and playing BP on our ping pong table every day.

## Architecture

With that out of the way, let's dive into the techincal side of things. The three main components of a web application are the frontend, backend, and database, and the technologies I'll use for each are **React**, **Flask**, and **MongoDB + Mongoengine**.

* **React**: React is everywhere at this point, and while I have a passing familiarity with both technologies, I want to improve my skills. I was originally going to use Redux but it is probably not worth it, and instead learning how to store cookies seems more worthwhile.
* **Flask**: I'm pretty comfortable with Flask, but additionally for a side project Flask is a really lightweight tool and doesn't force you to define a lot of things at the start. It also lets you add functionality really well.
* **MongoDB + Mongoengine**: I'm going with a NoSQL database because they give more flexibility than SQL databases, which is good for a side project since you don't really know how the structure is going to turn out as you work on it. Mongoengine is a Document-Object Mapper Library (ORM for Document Databases) that rests upon Pymongo. This is necessary for the complexity of the backend, and it's also a useful skill to learn.


The other thing to think about are relevant APIs and libraries for the project. There's a few aspects of this project which need outside libraries. One is working with Google auth and Google calendar, another is scheduling events at regular intervals, and finally sending email invites so that your friends that you want to meet with can sign up easily.

* **Google Auth/Calendar**: Google has an API for both auth and Calendar, and looking at the Calendar API, it is possible to get a user's free time, so that works out nicely. Finding common free intervals should be possible with a set intersection on a set of tuples for each day of the week.
* **Scheduling**: Of course we can just run cron jobs, but storing large text files (crontabs) doesn't really scream scalability. Instead we can use the [rq-scheduler](https://github.com/rq/rq-scheduler) library, which schedules tasks onto a Redis queue.
* **Sending Emails**: Google also offers a Gmail API that lets you send email from a draft, which is probably a good starting point. 

As a final note, I'll be referring to the scheduled reoccuring events as catchups throughout the document.

## Frontend Design 

Now that we have our technologies down, we can figure out the flow of the application. The first place to start is the frontend design of the application. I'll start by putting a Figma link here, which has side by side explanations of what's happening on the frontend.

https://www.figma.com/file/ab2hAkuBDUGqA0IBxfXHyzqH/Catchup?node-id=0%3A1


## Backend Design

We can start the backend design by reviewing our necessary REST endpoints for the frontend:

* **Endpoint**: /sign_in
  **Arguments**: User's email, user location
  **Methods**: POST
  **Description**: This endpoint serves to sign in the user. If the user email doesn't exist in the db, then the backend will create the user in the db. The backend will additionally generate a session token and serve it in the response to the POST request sent to it, which can be used to further validate actions. The session token will be added to the user's object in the database. The user's location (by longitutde and latitude) will also be stored with the user.
  
* **Endpoint**: /get_catchups
  **Arguments**: User's email, session token
  **Methods**: GET
  **Description**: This endpoint returns a list of all the catchups associated with that user, either ones they have created or ones they are part of or ones they haven't denied yet. 

* **Endpoint**: /accept_catchup
  **Arguments**: User's email, session token, catchup id
  **Methods**: POST
  **Description**: This endpoint notifies the backend that the user has decided to accept a catchup they were invited to. This moves the user from the catchup's invited list to its participant list. If everyone has accepted the catchup at this point, start scheduling events.

* **Endpoint**: /deny_catchup
  **Arguments**: User's email, session token, catchup id
  **Methods**: POST
  **Description**: This endpoint notifies the backend that the user has chosen not to accept a catchup. This removes the catchup from the user's list of catchups and removes the user from the catchup's list of invited users. If everyone else on the catchup has accepted, then start scheduling events for the catchup.
  
* **Endpoint**: /sign_out
  **Arguments**: User's email, session token
  **Methods**: POST
  **Description**: This endpoint will delete the session token from the user object in the database, signifying that user's session is done. If any actions are attempted but the token field is empty, we know that this is an invalid action, preventing replay attacks after sign out.

* **Endpoint**: /create_catchup 
  **Arguments**: User's email, session token, catchup title, list of invitees.
  **Methods**: POST
  **Description**: This is probably the most important endpoint and requires the most work. It starts by adding this catchup to the user's list of owned catchups. Then, for each invitee it adds this catchup to the user's list of catchups, creating the user if they don't exist. It also adds the user to catchups owner field. Then it sends out an email invite to each user inviting them to accept the catchup, and adds them to the catchup's invited list. It then calculates the common free time for everyone invited and generates a new event for the catchup and adds it to the catchup. Then, a task is scheduled to send Calendar invites to everyone who has accepted the catchup. 

* **Endpoint**: /update_catchup
  **Arguments**: User's email, session token, new catchup object
  **Methods**: POST
  **Description**: This endpoint is a little tricky. This takes the new catchup object and sets the catchup in the database to this catchup's object. However, based on the edited fields different actions have to be taken:
  * Title: No further action has to be taken.
  * User removed: The catchup has to be removed from the participant's list of catchups and the user is removed from the catchup's list of participants or invitees. If everyone else on the catchup's list of users has accepted then start scheduling events.
  * User added: The catchup has to be added to user's list, and the user has to be created if necessary. An email has to be sent to the added user inviting them to the catchup. The user is added to the catchup's invited list. If they haven't accepted yet, remove the catchup's scheduled task and wait since catchup's cannot be scheduled until everyone accepts.
  * Frequency changed: If the frequency is changed, then the catchup's frequency is updated, and new events will be scheduled according to that frequency. The current event is not modified.
  * New event generated: The catchup's event scheduling task is modified with the new event.

* **Endpoint**: /delete_catchup
  **Arguments**: User's email, session token, catchup id
  **Methods**: DELETE
  **Description**: Delete's the catchup from the database. First it deletes itself from each user's list of catchups and then finally deletes itself from the db.

* **Endpoint**: /leave_catchup
  **Arguments**: User's email, session token, catchup id
  **Methods**: POST
  **Description**: If a user decides to leave a catchup, the catchup is removed from the user's list of catchups. The user is also removed from the catchup's list of participants.
  
  
So those are the endpoints we need for the frontend, but clearly we need some support to make these endpoints work. I was originally going to just add some helper functions, but as I started listing them out I realized that there were going to be too many and some additional structure was needed. That's why I decided to use Mongoengine. So for Mongoengine, we need to define our document classes and types of fields they will have, in addition to their methods.

Everything is sort of intertwined, so I'll just present all the classes and comments here, and reading it through a couple times should help clarify how each component is linked to the others.


**User Class**
``` python
import util

class User:

    email = EmailField()
    session_token = BinaryField(max_bytes=16) #16 bytes = 128 bits
    location = GeoPointField()
    catchups = ListField(UUIDField())
    
    def create_user(user_email, user_location):
        user_obj = User(email = user_email, 
                        session_token = 0,
                        location = user_location,
                        catchups=[]).save()
        return user_obj
    
    def generate_session_token(self):
        self.session_token = generate_token()
        self.save()
        return self.session_token()
    
    def remove_catchup(self, catchup_id):
        self.catchups.remove(catchup_id)
        self.save()
    
    def remove_session_token(self):
        self.session_token = 0
        self.save()
        
    
        
```

**Catchup Class**
```python
import util
from event import Event

class Catchup:
    
    catchup_id = UUIDField()
    catchup_owner = EmailField()
    accepted_users = ListField(EmailField())
    invited_users = ListField(EmailField())
    current_event = EmbeddedDocument(Event())
    frequency = StringField()
    free_times = ListField((DateTimeField(), DateTimeField()))
    central_location = GeoPointField()
    common_radius = IntField()
    
    def create_catchup(owner, invited_list):
        catchup_obj = Catchup(catchup_id = generate_uuid(),
                              catchup_owner = owner,
                              accepted_users = [owner],
                              invited_users = invited_list,
                              current_event = None,
                              frequency = "once a week",
                              free_times = [],
                              central_location = None,
                              common_radius = IntField).save()
        catchup_obj.email_all_invites()
        catchup_obj.save()
        return catchup_obj
    
    def accept_user(self, user_email):
        self.invited_users.remove(user_email)
        self.accepted_users.append(user_email)
        self.check_and_schedule()
        self.save()
        
    def check_and_schedule(self):
        if self.validate_acceptance():
            self.generate_new_event()
            self.schedule_event()
    
    
    def remove_user(self, user_email):
        if user_email in self.accepted_users:
            self.accepted_users.remove(user_email)
        if user_email in self.invited_users:
            self.invited_users.remove(user_email)
        self.check_and_schedule()
        self.save()
        
    def add_user(self, user_email):
        self.accepted_users.append(user_email)
        self.save()
    
    def update_frequency(self, frequency):
        self.frequency = frequency
        self.save()
    
    def email_all_invites(self):
        for user_email in self.invited_users:
            self.email_user_invite(user_email)
    
    def email_user_invite(self, user_email):
        google_auth()
        # GMail API
    
    def generate_new_event(self):
        #Get free times on each generation to deal with updates in calendars
        self.get_free_times()
        self.get_central_location()
        self.get_common_radius()
        switch = randint(0,2)
        if switch == 0:
            self.generate_eventbrite_event(start_time, end_time)
        if switch == 1:
            self.generate_yelp_event()
        if switch == 2:
            self.generate_stored_event()
        self.save()
        
    def generate_eventbrite_event(self):
        #return Event based on Eventbrite API and central location & radius
        self.current_event = Event
    
    def generate_yelp_event(self):
        #pick Event from DB with yelp field is true
        #use Yelp API to fill in event details
        #Use central location & radius
        self.current_event = Event
    
    def generate_stored_event(self):
        #return pregenerated event
        self.current_event = Event
    
    def get_free_times(self):
        google_auth()
        #Use google calendar
        #Update based on new event added??
        self.free_times = free_times
    
    def get_central_location(self):
        #Use weighted average
        self.central_location = central_location
    
    def get_common_radius(self):
        self.common_radius = common_radius
    
    def validate_acceptance(self):
        if len(self.invited_users):
            return False
        return True

    def schedule_event(self):
        google_auth()
        #Add event to everyone's calendars
        self.schedule_task()
    
    def schedule_task(self):
        #schedule task to generate event by frequency using python-rq
        #
    
    def delete_catchup(catchup_id):
        catchup = Catchup.objects.get(catchup_id = catchup_id)
        for user_email in catchup.accepted_users:
            user = User.objects.get(email = user_email)
            user.remove_catchup(catchup_id)
        for user_email in catchup.invited_users:
            user = User.objects.get(email = user_email)
            user.remove_catchup(catchup_id)
        catchup.delete()
```

**Event Class**
```python 
class Event(EmbeddedDocument):

    event_name = StringField()
    event_desc = StringField()
    event_start_time = DateTimeField()
    event_end_time = DateTimeField()
    event_location = GeoPointField()
    
    def get_event_address(self):
        #Geolocation
        return address #string
    


```

**Utility Class**
```python 
def generate_token():
    #returns 128 bit random token

def validate_action(user_email, session_token):
    user = User.object.get(email=user_email)
    token = user.session_token
    return token == session_token
    
def google_auth(user_email):
    #Do any necessary auth
def generate_uuid():
    #return uuid


```


























 

