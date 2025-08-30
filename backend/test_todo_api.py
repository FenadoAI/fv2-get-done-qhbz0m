import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8001/api"

def test_todo_api():
    """Test all Todo API endpoints"""
    
    print("🧪 Testing Todo API endpoints...")
    
    # Test 1: Create a new todo
    print("\n1️⃣ Testing CREATE todo")
    create_data = {
        "title": "Test Todo",
        "description": "This is a test todo item"
    }
    
    response = requests.post(f"{BASE_URL}/todos", json=create_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        created_todo = response.json()
        todo_id = created_todo["id"]
        print(f"✅ Created todo: {created_todo['title']}")
        print(f"Todo ID: {todo_id}")
    else:
        print(f"❌ Failed to create todo: {response.text}")
        return
    
    # Test 2: Get all todos
    print("\n2️⃣ Testing GET all todos")
    response = requests.get(f"{BASE_URL}/todos")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Retrieved {len(todos)} todos")
        for todo in todos:
            print(f"  - {todo['title']} (Completed: {todo['completed']})")
    else:
        print(f"❌ Failed to get todos: {response.text}")
    
    # Test 3: Get specific todo
    print("\n3️⃣ Testing GET specific todo")
    response = requests.get(f"{BASE_URL}/todos/{todo_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        todo = response.json()
        print(f"✅ Retrieved todo: {todo['title']}")
    else:
        print(f"❌ Failed to get todo: {response.text}")
    
    # Test 4: Update todo
    print("\n4️⃣ Testing UPDATE todo")
    update_data = {
        "title": "Updated Test Todo",
        "description": "This todo has been updated",
        "completed": True
    }
    
    response = requests.put(f"{BASE_URL}/todos/{todo_id}", json=update_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        updated_todo = response.json()
        print(f"✅ Updated todo: {updated_todo['title']}")
        print(f"Completed: {updated_todo['completed']}")
    else:
        print(f"❌ Failed to update todo: {response.text}")
    
    # Test 5: Create another todo for testing
    print("\n5️⃣ Creating another todo for testing")
    create_data2 = {
        "title": "Second Test Todo",
        "description": "Another test item"
    }
    
    response = requests.post(f"{BASE_URL}/todos", json=create_data2)
    if response.status_code == 200:
        second_todo = response.json()
        second_todo_id = second_todo["id"]
        print(f"✅ Created second todo: {second_todo['title']}")
    else:
        print(f"❌ Failed to create second todo: {response.text}")
        second_todo_id = None
    
    # Test 6: Get all todos again to see both
    print("\n6️⃣ Testing GET all todos (should show 2 items)")
    response = requests.get(f"{BASE_URL}/todos")
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Now have {len(todos)} todos:")
        for todo in todos:
            status = "✓" if todo['completed'] else "○"
            print(f"  {status} {todo['title']}")
    
    # Test 7: Delete todo
    print("\n7️⃣ Testing DELETE todo")
    response = requests.delete(f"{BASE_URL}/todos/{todo_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Deleted todo successfully")
    else:
        print(f"❌ Failed to delete todo: {response.text}")
    
    # Test 8: Verify deletion
    print("\n8️⃣ Verifying deletion")
    response = requests.get(f"{BASE_URL}/todos")
    if response.status_code == 200:
        todos = response.json()
        print(f"✅ Now have {len(todos)} todos (should be 1)")
        
        # Clean up - delete the second todo
        if second_todo_id:
            requests.delete(f"{BASE_URL}/todos/{second_todo_id}")
            print("🧹 Cleaned up remaining test todo")
    
    print("\n🎉 Todo API testing completed!")

if __name__ == "__main__":
    try:
        test_todo_api()
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the backend is running on http://localhost:8001")
    except Exception as e:
        print(f"❌ Error during testing: {e}")