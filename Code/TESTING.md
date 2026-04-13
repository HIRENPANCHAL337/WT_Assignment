API Testing Examples Using curl

Test in command prompt (Windows) or terminal (Mac/Linux)

1. Test Server Running
curl http://127.0.0.1:5500

Expected response:
{"message":"API Server is running"}

2. Register User
curl -X POST http://127.0.0.1:5500/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John\",\"email\":\"john@test.com\",\"password\":\"pass123\",\"phone\":\"1234567890\"}"

3. Login User
curl -X POST http://127.0.0.1:5500/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@test.com\",\"password\":\"pass123\"}"

Save the token from response, then use it for authenticated requests.

4. Get User Profile (replace 1 with actual user id)
curl http://127.0.0.1:5500/api/auth/profile/1

5. Get All Initiatives
curl http://127.0.0.1:5500/api/initiatives

6. Create Initiative (replace YOUR_TOKEN with actual token)
curl -X POST http://127.0.0.1:5500/api/initiatives ^
  -H "Content-Type: application/json" ^
  -H "authorization: YOUR_TOKEN" ^
  -d "{\"title\":\"Test\",\"description\":\"Test description\",\"status\":\"active\"}"

7. Get All Events
curl http://127.0.0.1:5500/api/events

8. Get Single Event (replace 1 with event id)
curl http://127.0.0.1:5500/api/events/1

9. Create Event (replace YOUR_TOKEN with actual token)
curl -X POST http://127.0.0.1:5500/api/events ^
  -H "Content-Type: application/json" ^
  -H "authorization: YOUR_TOKEN" ^
  -d "{\"title\":\"New Event\",\"description\":\"Event description\",\"event_date\":\"2026-05-15 10:00:00\",\"location\":\"City\"}"

10. Submit Contact Form
curl -X POST http://127.0.0.1:5500/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane\",\"email\":\"jane@test.com\",\"subject\":\"Query\",\"message\":\"Hello\"}"

11. Get All Contacts
curl http://127.0.0.1:5500/api/contact

12. Update Initiative (replace 1 with initiative id and YOUR_TOKEN)
curl -X PUT http://127.0.0.1:5500/api/initiatives/1 ^
  -H "Content-Type: application/json" ^
  -H "authorization: YOUR_TOKEN" ^
  -d "{\"title\":\"Updated\",\"description\":\"New desc\",\"status\":\"active\"}"

13. Delete Initiative (replace 1 with initiative id and YOUR_TOKEN)
curl -X DELETE http://127.0.0.1:5500/api/initiatives/1 ^
  -H "authorization: YOUR_TOKEN"

14. Delete Event (replace 1 with event id and YOUR_TOKEN)
curl -X DELETE http://127.0.0.1:5500/api/events/1 ^
  -H "authorization: YOUR_TOKEN"

NOTES FOR WINDOWS:
- Use ^ for line continuation
- Or write entire command on single line
- Use double quotes for JSON strings
- Escape inner quotes with backslash

USING POSTMAN (Easier):
1. Import requests as collection
2. Set variables for base URL and token
3. Click on requests to test
4. Auto-format JSON responses

Test order recommended:
1. Register a user
2. Login to get token
3. Copy token from response
4. Test protected endpoints with token
5. Create initiatives/events
6. Get all items
7. Update items
8. Delete items
