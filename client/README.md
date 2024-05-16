# Client Side Documentation

## Components

These are the Components and what they do:

#### `Admin Navbar`

It is the navbar on the Admin Side with a few icons for navigation

#### `Admin Sidebar`

It is the sidebar at Admin Side, it is used to navigate to the various pages.

#### `Chart`

The component that contains Graph

#### `Datatable`

This component is used again and again to call list of all users, tasks, updates, etc.

For users a separate page opens when user clicks on view but when they click on view of tasks or updates a pop up appears

For edit another page appears for all of them

#### `EventModal`

This is the pop up that appears when user opens to view an event with event poster and other details. If the user is the owner or creator of the event they can edit/delete it as well

#### `Featured`

This is the total revenue box on main page 

#### `Modal`

This is the pop up that opens on clicking view on tasks and updates entries. 

#### `Navbar`

It is the navbar at Student Side

#### `NavSidebar`

It is the sidebar at Student Side

#### `Query`

This is used to post queries by users from client side to admin side

#### `Table`

This is used to show the upcoming/latest events on main landing page. Only shows a few select details

#### `Widget`

These are the four boxes on landing page

## Context

#### `AuthContext`

Saves the details of the user in local storage when they are logged in 

#### `DarkModeContext`

Sets and returns the current theme

#### `DarkModeReducer`

Function to toggle the dark mode

## Hooks

#### `useFetch`

It contains functions that are used to fetch the data based on the url provided to the function using axios

## Pages

#### `Event`

#### `Home`

It loads home page for both admin and user side based on the type of prop passed to it

#### `List`

It is the page which renders the data tables based on the props passed

#### `Login`

Login page is redirects to different areas based on which side we are logging into

#### `Single`

Single page displays all the details of the user

#### `Task`

#### `Update`

#### `User`

## Source

#### `DataTable Source`

* eventColumns - contains specifications of columns of events that need to be displayed

* taskColumns - contains specifications of columns of tasks that need to be displayed

* updateColumns - contains specifications of columns of updates that need to be displayed

* userColumns - contains specifications of columns of users that need to be displayed

#### `Form Source`

* eventInputs - inputs that are needed in forms for  creating/editing events 

* taskInputs - inputs that are needed in forms for  creating/editing tasks 

* teamsAndRoles - drop down for teams and roles

* updateInputs - inputs that are needed in forms for  creating/editing updates 

* userInputs - inputs that are needed in forms for  creating/editing users 

## Style

#### `Dark.scss`

All specifications for dark mode

#### `Form.scss`

This contains css for all the forms present in the website except for the ones involved in events