# A Sinple Blog Website With Basic Admin Panel And User Panel With MERN

# Admin Email and Password
email - admin123@gmail.com
password - Admin123!@#

## How To Setup The Backend
1. Clone the repository
->  git clone <backend-repo-url>

2.  Install the Dependencies
-> npm i bcryptjs cors nodemon mongodb mongoose jsonwebtoken dotenv express imagekit multer validator

3. Setting up the environment variables
[.env.example](./server/.env.example)
-> Give a Port number in .env or server.js
-> Frontend Port in server cors middleware
-> JWT_SERCRET in the .env for the token
-> Your Mongo_URI in .env
-> For imagekit => public, private key and URL endpoint from your imagekit account

4. Run the backend server
      npm run start(node)  ||  npm run dev(nodemon)

## How To Setup The Frontend
1. Clone the Frontend Repo

2. Install the dependencies
-> npm i react-router-dom react-hot-toast moment quill axios dompurify

3. Set up the .env varibles
-> In the auth context directly put the backend url or import the backend url from .env by creating in frontend root folder

4. Starting the server
-> npm run dev (reactVite setup)

# Summary
## Problems Faced
1. After checking the api's and then fetching the api's with axios. There were many toast error for user or body not defined and had to manage all the backend to first check the user befor sending the request or checking the token (as sometimes it was showing authentication required first and then normally fetching) so had to give the extra checks eg- req.user?.role so if the user was not admin it didn't just crash with an error
2. The idea of quill editor was from youtube and i thought if just dangerouslySetHTML will solve the tags but in the ui it was showing junk character and had to use copilot generated code with truncate (Also used in comments and Blog Details page). It was nightmare setting it up for the first time could have used just text area
3. For user not logged in still showing toast because of the mixing pages requiring auth with the public pages (blogDetails)
4. first setup the axios with the token on refresh, good for loggedin buildup of pages but was causing error for logged out so manually set all the headers with the function which checks both, token is there or not.
5. The comment with blogId from params created problem as it was returning null but the backend was working fine and had to convert the id to string to match and it worked
6. Editing the user and the blog again with quill had to be set up and the state was then changed.
For getting the data was actually easy from the context and on update just need to set the state but quill needed to be set up (mostly copy paste)
7. Setting up token and user  and parsing the user in the auth and when setting the user in localStorage needed to be done because object can't be stored and would give [object object] but after stringify (setItem) and the parse to get the item from the object.
 

Note - When fetching and setting up headers for auth needed to make sure the id and data or content needed should align with backend otherwise the calls will fail and didn't need to give the content type for most becoz of axios but still did for creating blog

## Improvements
1. The current css can be improved for multiple devices (media query)
2. redundant code, could have used the helper for handling error and async function
3. still shows some toast error becoz of bad forntend and backend checks like roles and tokens
4. Could create a backend search controller with filter and pagination but currently don;t know how to manage or arrange pagination
5. auth can be improved with otp, password, change, and profile pic will require additional nodemailer and more backend controller

### direct checkpoints
[setting the server](#setting-backend-server)
[Auth Controller](#auth)
[Blog Controller](#blog)
[User Controller](#user-controller)
[Comment Controller](#comment-controller)

[Frontend Auth](#frontend---auth-checkpoints)
[Frontend Home](#frontend---home--checkpoints)
[Blog Context](#blog-context-logic-checkpoints)
[User Context](#user-context-logic-checkpoints)
[Comment Context](#comment-context-logic-checkpoints)
[Dashboard Context](#dashboard-context-logic-checkpoints)
[Frontend Dashboard](#frontend---dashboard-checkpoints)
[Create Blog](#create-blog-checkpoints)
[Manage Blog](#manage-blogs-checkpoints)
[Manage Users](#manage-users-admin-only-checkpoints)
[Manage Comment](#manage-comments-checkpoints)
[Profile](#profile-checkpoints)


# Backend (Server) 
[Go to frontend](#frontend)

```
server/
├─ config/
│  ├─ dbConnection.js
│  ├─ imagekit.js
│  └─ seedAdmin.js
├─ controllers/
│  ├─ blogController.js
│  ├─ commentController.js
│  └─ userController.js
├─ middleware/
│  ├─ multer.js
│  ├─ requireAdmin.js
│  └─ requireAuth.js
├─ model/
│  ├─ blogModel.js
│  ├─ commentModel.js
│  └─ userModel.js
├─ routes/
│  ├─ blogRoutes.js
│  ├─ commentRoutes.js
│  ├─ dashboardRoutes.js
│  └─ userRoutes.js
├─ .env
├─ .gitignore
├─ package-lock.json
├─ package.json
└─ server.js
```

### Dependencies
-> nodemon
-> express
-> cors
-> bcryptjs (hash and salt email and compare it for auth)
-> jsonwebtoken (create token for auth)
-> dotenv (for sensitive environment variables in backend)
-> validator (for email and password)
-> monogodb
-> mongoose
-> multer (for image stores in local file)
-> imagekit (from multer to this for saving image online)


## Setting Backend Server 
[Checkpoints](#direct-checkpoints)
[server](./server/server.js)

-> Set up the server with express, config dotennv for sensitive info, create a db config to set up connection with mongodbAtlas 
(Note -> Create a middleware for path and method for better request management and error management)
-> Set up middlewares for cors & parse
-> finally created the home page testing route and made the app listen on a port

### Setting up the DbConnection

-> get the connection url from the compass, provide it through dotenv and then basic connection function with error and connection logs

### Setting up multer and imagekit 

-> multer stores the image in local folder and then through backend can upload it to imagekit and clear the local file for better memeory management
-> To set up provide the keys from your imagekit account and then just export it use it when uploading the image from multer
-> A basic multer setup that stores the image in local disk in variable upload so to access when uploading in imagekit

## Setting up the Auth before all the other controllers (backend)

### Auth 

#### Auth Model
[Auth Model](./server/model/userModel.js)
-> simple schema with name, email, password and role (for user and admin) to create the user and manage in mongodb
-> created a static user signup and login controller here that can be used in the controller
-> For Signup it just checks the email, vaidate the email and password and the after checking it hashes the password and create the user and return it
-> For Login compares the password after checking if the email is there and then return the user

#### Auth Controller
[Auth Controller](./server/controllers/blogController.js)
-> Just create the token with _id (be consistent as this token with _id will be used in frontend for login) using jsonwebtoken
-> In Signup controller get the name, email and password from the client frontend body and then call the already created signup static method. Manage the errors with RestfulAPI. Stores user in mongodb
-> In Login controller get the email and password from the client frontend body and then call the already created login static method. Manage the errors with RestfulAPI. 

[Auth Routes](./server/routes/userRoutes.js)

(Note -> Set up this backend to the frontend before creating the other controller for user)
[Go to Frontend Auth Setup](#frontend---auth)


### Blog

#### Blog Model
[Checkpoints](#direct-checkpoints)
[Blog Model](./server/model/blogModel.js)
-> Schema containing the title, subTitle, category, Content, authorId, image, imageId (to delete the image from the local file created by multer), isPublished (so only admin can publish the blog)

#### Blog Controller
[Blog Controller](./server/controllers/blogController.js)
-> It will have the following apis

  createBlog -> It creates the blog with form data (becoz of image, can create json for data also but form data is convenient in testing apis faster). 
  -> for images upload need to create the login -> image from req.file then upload the file by reading it from buffer using fs (stored in multer disk locally) and upload it on imagekit the delete the local file by unlinking it
  -> if the field are missing provide the messages if not create the blog in mongodb (image url will be sent to mongodb that is in the imagekit)
  -> try catch will manage the errors

  getAllBlogs -> as the app has user and admin role here just filter the find with isPublished true for the users and those who created the blog can also see their blog in dashboard section just match the authorId with the userId (populating name to access the name of the author for the frontend). User will be checked from the auth middleware (req.user)

  getSingleBlog -> for admin can get any blog by id but for user only published one and their own drafted one. The id will be taken from the params. User will be checked from the auth middleware (req.user)

  updateBlog -> for updating the blog, it will also be user specific like above and for the logic the delete the image, will use the imageFileId and simply use imagekit.deleteFile. then upload the new one similar to when creating blog. For updating use the patch method for partial updates.

  deleteBlog -> for deleting the blog, first get the blog by id. Then delete the image with its id and finally deletOne

  togglePublish -> it takes the blogid from the params, user from auth middleware (only admin can upload). As for logic simply change isPublished state (true to false and vice-versa) and save the blog.

  dashboard (for convenience) -> It simply gets the blog, drafts, later comments and their counts for frontend

  [Blog Routes](./server/routes/blogRoutes.js)

#### Require Auth and Require Admin (for extra safety of some routes like approving)
[Require Auth](./server/middleware/requireAuth.js)
[Require Admin](./server/middleware/requireAdmin.js)
-> for auth => it gets the token from headers.authorization (case sensitive)
-> As the token created with jsonwebtoken has 3 parts with the token in the [1] (token index [0 1 2])
-> Split the token, verify it and can bind to id of user and to user in fronted and backend auth cases use  user = req.user

-> requireAdmin provides an extra safetynet to already user dependent logic in routes

  [Go to Frontend integration](#frontend---home)

#### User Controller
[User Controller](./server/controllers/userController.js)
-> Logic is in the same controller as for auth
-> Apis for the users 
{
  getProfile - for user to get their own data on the dashboard for the profile page. The user id comes from the auth middleware. Logic is simple findById

  updateUser - as it is patch for user to update a particular field instead of whole. Just append if(name) then user.name = name and so on. Finally save in the db. Role specific (admin can update and any but user only their own)

  deleteUser - Role specific. Deletes the user from the db

  getAllUsers - For admin only to get all the users in the db. Routes extra secure with requireAdmin
}

[user Routes](./server/routes/userRoutes.js)

#### Comment Model
[Checkpoints](#direct-checkpoints)
[comment model](./server/model/commentModel.js)
-> blogId refrenced to blog, authorId (user) => refrenced to userId, content, isApproved (for admin) 
-> only logged in persons can comment so the routes are protected

#### Comment Controller
[comment controller](./server/controllers/commentController.js)
Apis from user and admin perspective
{
  addComment - to add a comment to the blog. Will require blogId (used from body can use params but frontend fetch will change) and the content. Find the blog with id and create the comment with content

  getBlogComments - user can access approved comments and user can access all on the blog (a simple filter)

  approveComment - not a toggle so just change the state from false to true (admin only) 

  updateComment - user can update their own and admin can access any and the updated comment will wait for the approval of admin

  deleteComment - user their own and admin all. Find the comment and delete

  getAllComments - role sensitive and filter and populate as needed for frontend required data
}


[Go to frontend Integration in dashboard](#frontend---dashboard)









# Frontend

```
client/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  ├─ add_icon.svg
│  │  ├─ arrow.svg
│  │  ├─ assets.js
│  │  ├─ bin_icon.svg
│  │  ├─ blog_icon.png
│  │  ├─ comment_icon.svg
│  │  ├─ cross_icon.svg
│  │  ├─ dashboard_icon_1.svg
│  │  ├─ dashboard_icon_2.svg
│  │  ├─ dashboard_icon_3.svg
│  │  ├─ dashboard_icon_4.svg
│  │  ├─ email_icon.png
│  │  ├─ facebook_icon.svg
│  │  ├─ favicon.svg
│  │  ├─ googleplus_icon.svg
│  │  ├─ gradientBackground.png
│  │  ├─ home_icon.svg
│  │  ├─ list_icon.svg
│  │  ├─ logo_light.svg
│  │  ├─ logo.png
│  │  ├─ react.svg
│  │  ├─ rich-text-css.txt
│  │  ├─ star_icon.svg
│  │  ├─ tick_icon.svg
│  │  ├─ twitter_icon.svg
│  │  ├─ upload_area.svg
│  │  └─ user_icon.svg
│  ├─ components/
│  │  ├─ Dashboard/
│  │  │  ├─ BlogTableItem.jsx
│  │  │  ├─ EditBlog.jsx
│  │  │  └─ Sidebar.jsx
│  │  ├─ Helper/
│  │  │  ├─ Loader.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  └─ Home/
│  │     ├─ BlogList.jsx
│  │     ├─ BlogTile.jsx
│  │     ├─ Footer.jsx
│  │     ├─ Header.jsx
│  │     ├─ Navbar.jsx
│  │     └─ Newsletter.jsx
│  ├─ context/
│  │  ├─ AppProvider.jsx
│  │  ├─ AuthContext.jsx
│  │  ├─ BlogContext.jsx
│  │  ├─ CommentContext.jsx
│  │  ├─ DashboardContext.jsx
│  │  └─ UserContext.jsx
│  ├─ hooks/
│  │  ├─ useAuthContext.jsx
│  │  ├─ useBlogContext.jsx
│  │  ├─ useCommentContext.jsx
│  │  ├─ useDashboardContext.jsx
│  │  ├─ useLogin.jsx
│  │  ├─ useSignup.jsx
│  │  └─ useUserContext.jsx
│  ├─ pages/
│  │  ├─ Dashboard/
│  │  │  ├─ CreateBlog.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ DashboardLayout.jsx
│  │  │  ├─ ManageBlog.jsx
│  │  │  ├─ ManageComments.jsx
│  │  │  ├─ ManageUsers.jsx
│  │  │  └─ Profile.jsx
│  │  ├─ BlogDetails.jsx
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  └─ Signup.jsx
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
└─ vite.config.js

```

-> tailwind 
-> react-router-dom
-> axios
-> react-hot-toast (for success and error messages)
-> moment (for date from backend)
-> quill (for create blog page)
-> dompurify (to clear tags (if any) from create blog quill)

## Frontend - Auth [Checkpoints](#direct-checkpoints)

### Creating the Auth Context using reducers
[Auth Context](./client/src/context/AuthContext.jsx)
[Sign in Hook](./client/src/hooks/useSignup.jsx)
[Login Hook](./client/src/hooks/useLogin.jsx)
[signup page](./client/src/pages/Signup.jsx)
[login page](./client/src/pages/Login.jsx)

-> first setup the axios by providing the backend url (can also provide the token from page reload in axios so don't have to use on every axios fetch)
-> A basic context with login and logout function with reducers.Just set the user and token or remove them on call
-> On page refresh check the user token and user and parse the user and give the token and user in LOGIN state as payload
wrap the context in the main or a different common provider for apps containing multiple contexts

### Creating the useSignup and useLogin hooks

-> A simple backend fetch with axios and returning the function
-> for signup takes the name, email and password from the client (used in the signup page) and call the backend api to create the user
-> for login, email and password, calls the backend api and logs in the user by comparing to access the protected route 

### Signup and Login Page

-> CSS with tailwind and on submit of the form calls the useSignup (signup method) and set the name, email and password locally with state
-> CSS with tailwind and on submit of the form calls the useLogin (login method from the auth context) and set the email and password locally with state

[Go to Backend](#blog-model)

## Frontend - Home  [Checkpoints](#direct-checkpoints)
[Navbar](./client/src/components/Home/Navbar.jsx)
[Header](./client/src/components/Home/Header.jsx)
[Blog List](./client/src/components/Home/BlogList.jsx)
[Blog Tile](./client/src/components/Home/BlogTile.jsx)
[Newsletter](./client/src/components/Home/Newsletter.jsx)
[footer](./client/src/components/Home/Footer.jsx)
{The home page will have the navbar with logo, login button (if user is logged in will change to dashboard and if its admin will change to admin dashboard).
The header with the search bar to actually search and filter the blogs in the main part.
The Body section which will show the recent published blogs to the client logged in or not
Newsletter to subscribe for news about update and blogs
Finally the footer section with the important links}

#### Header search filter logic
-> since the search is in the header and the blogs are in blogList in frontend just code the filter logic in home and prop it in both the pages. For header the search and setSearch for getting the value from input and the filter blog logic to the bloglist and just render the display with filter if it changes.
-> A clear search button to reset the states

#### Blog List
-> Simple mapping of blogs from blog context

### Blog Context Logic [Checkpoints](#direct-checkpoints)
[Blog Context](./client/src/context/BlogContext.jsx)
All the blog apis in this context 
Fetches from the api
{
  -> initialState has blogs, singleBlog, searchResult (currently only used to clear the search bar can be used for backend filter logic, currently not used anywhere)
  -> reducers have the states
  -> with this context can use these with all the fetched axios api in this context globally
}
--> ENHANCEMENT -> A handleError function to use everywhere so as not to repeat the same code in catch block

#### NewsLetter only has the css without the logic for sending email 

#### Same for footer and the content is in the assets.js

Before creating the dashboard. Created rest of the controller for comment and user
[Go to user controller](#user-controller)
[Go to comment controller](#comment-controller)

### User Context Logic [Checkpoints](#direct-checkpoints)
[User Context](./client/src/context/UserContext.jsx)
-> Same handle error logic for the catch blog
-> reducers for profile and users
-> context carries all logic so as to be used in multiple pages
-> fetch the apis using axios with the backend routes and the dispatch the state with the payload (always return the response)


### Comment Context Logic [Checkpoints](#direct-checkpoints)
[Comment Context](./client/src/context/CommentContext.jsx)
-> Again handle error logic
-> reducers with commentbyblog, usercomments (will have all the comments)
{Note-> for commentByBlog have the initial or prior state then load the payload with id so the state remains fresh when performing other operations on the comment}
-> fetches all the api's from the backend and dispath the payload

### Dashboard Context Logic [Checkpoints](#direct-checkpoints)
[Dashboard Context](./client/src/context/DashboardContext.jsx)
-> A seperate one to avoid complicating the other contexts as they already have their own api's fetch logic and creating another state in the existing will flood it
-> fetches the dashboard api created in the blog controller and gives the count as well as the blogs, drafts and comments 
{Note -> The backend has the data set in an order so when fetching and using the data keep it in mind. ex - for blog count it is in the stats inside the dashboard so it will be => dashboard.stats.totalBlogs}

## Frontend - Dashboard [Checkpoints](#direct-checkpoints)

It has a sidebar and outlet with multiple pages for user and admin

#### Sidebar 
[Sidebar](./client/src/components/Dashboard/Sidebar.jsx)
-> Created with css (with width)
-> Contains the link to all the pages in the outlet (the main content area keeps the sidebar persistent)

-> ENHANCEMENT FOR SIDEBAR CSS => a static css for all the links so when clicked changes the css for the sidebar (if clicked on the link, change the css with path)

#### Outlet Pages
[Dashboard Layout](./client/src/pages/Dashboard/DashboardLayout.jsx)
[Dashboard](./client/src/pages/Dashboard/Dashboard.jsx)
[Create Blog](./client/src/pages/Dashboard/CreateBlog.jsx)
[Manage Blog](./client/src/pages/Dashboard/ManageBlog.jsx)
[Manage Comment](./client/src/pages/Dashboard/ManageComments.jsx)
[Profile](./client/src/pages/Dashboard/Profile.jsx)
[Manage User](./client/src/pages/Dashboard/ManageUsers.jsx)

##### Dashboard 
-> Role specific => user sees their own (doesn't contain graph or charts)
-> has the data for the amount of blogs, comments and drafts 
-> for admin a table to see all the blogs and a button to toggle publish
-> user sees their own => published and drafts
{Doesn't have much logic here. The already fetched data is being used from the context}

##### Create Blog [Checkpoints](#direct-checkpoints)
-> This uses quill for context instead of textarea. Got the idea about it from youtube video.
-> Need to set the quill ref on page refresh
-> Sets the data locally in all the fields. Image is a file will require to target the file[0]
-> need refrence for quill for editing and the quill ref for its current state
-> as it is needed to be created from formData as in backend. just use formData.append from new formdata
-> after this call the create blog and restore the states to null

##### Manage Blogs [Checkpoints](#direct-checkpoints)
-> Role Specific => user their own (approved and drafted), admin all
-> update and delete the blogs
-> for delete call the fetch backend function and provide the id(blogId) from body
-> edit navigates to another page in the dashboard to edit (patch) the blog
-> same as when creating the blog => setup the quill and the state with the ref for quill and get the data from the singleBlog state from blog context and set these states so the fields have all the data of the blogs and the client can just patch it
{Note -> as it allows patch append with the ternary ops (?.) so as to avoid errors for empty fields}
-> After appending, call the updateBlog 

{Problems occurred in this -> when updating the blog the updated blog had the html tags and when i used dasngerously set html it was showing random symbols in place of tags so had to use copilot code to solve this issue}

##### Manage Users (admin only) [Checkpoints](#direct-checkpoints)
-> to edit the user it will require the user id and the data to be edited. 
-> The logic is same as the rest of the edits
-> when clicked the edit button will get the user id then can edit the fields
-> as for the editing fields will only show when the id is provided to edit the changes
-> To avoid saving a blank password created an if logic where with the previos state delete the the blank password and update it with the old one
-> to delete call the delete function with the userId

{problem occured -> When updating the user was causing an infinite Loader so had to change the blog context loading state}

##### Manage Comments [Checkpoints](#direct-checkpoints)
-> Doesn't have edit functionality yet
-> approves and delete the comment for admin
-> delete the comment for user

{problem occured -> the approve button still showing after approving the comment until page refresh and after delete still showing the deleted comment until refresh so had to call fetchUserComment to refresh after the functionality}

##### Profile [Checkpoints](#direct-checkpoints)
-> simple input fields containing the data of the current state
-> as the form as a whole is being updated to instead of state like name, email and password and target the value, target the name value
-> call the update(id, data) and delete(id) function


