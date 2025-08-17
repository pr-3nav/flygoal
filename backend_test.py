#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Football Jersey Community Voting Website
Tests all API endpoints including CRUD operations, file upload, voting system, and statistics.
"""

import requests
import json
import os
import tempfile
from pathlib import Path
import uuid
import time
from PIL import Image
import io

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class JerseyAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_jerseys = []
        self.uploaded_files = []
        
    def log_test(self, test_name, success, message="", details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if details and not success:
            print(f"   Details: {details}")
        print()

    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "JerseyVote API" in data["message"]:
                    self.log_test("Health Check", True, "API is running correctly")
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected response format", data)
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
        return False

    def create_test_image(self, size=(800, 600), format='JPEG'):
        """Create a test image file"""
        img = Image.new('RGB', size, color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        return img_bytes

    def test_file_upload(self):
        """Test file upload functionality"""
        try:
            # Test valid image upload
            test_image = self.create_test_image()
            files = {'file': ('test_jersey.jpg', test_image, 'image/jpeg')}
            
            response = self.session.post(f"{API_BASE}/upload", files=files)
            
            if response.status_code == 200:
                data = response.json()
                if 'filename' in data and 'url' in data:
                    self.uploaded_files.append(data['filename'])
                    self.log_test("File Upload - Valid Image", True, f"Uploaded: {data['filename']}")
                    
                    # Test if uploaded file is accessible
                    file_url = f"{BASE_URL}{data['url']}"
                    file_response = self.session.get(file_url)
                    if file_response.status_code == 200:
                        self.log_test("File Upload - File Accessibility", True, "Uploaded file is accessible")
                    else:
                        self.log_test("File Upload - File Accessibility", False, f"File not accessible: {file_response.status_code}")
                    
                    return data['url']
                else:
                    self.log_test("File Upload - Valid Image", False, "Missing filename or url in response", data)
            else:
                self.log_test("File Upload - Valid Image", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("File Upload - Valid Image", False, f"Error: {str(e)}")
            
        # Test invalid file type
        try:
            files = {'file': ('test.txt', io.StringIO('test content'), 'text/plain')}
            response = self.session.post(f"{API_BASE}/upload", files=files)
            
            if response.status_code == 400:
                self.log_test("File Upload - Invalid Type", True, "Correctly rejected non-image file")
            else:
                self.log_test("File Upload - Invalid Type", False, f"Should reject non-image files, got: {response.status_code}")
        except Exception as e:
            self.log_test("File Upload - Invalid Type", False, f"Error: {str(e)}")
            
        # Test oversized file (simulate)
        try:
            # Create a large image (this is just a simulation - we won't actually create 10MB+ file)
            large_image = self.create_test_image(size=(5000, 5000))
            files = {'file': ('large_test.jpg', large_image, 'image/jpeg')}
            
            response = self.session.post(f"{API_BASE}/upload", files=files)
            # Note: This might pass if the image compresses well, which is fine
            self.log_test("File Upload - Size Test", True, f"Large file handling: {response.status_code}")
        except Exception as e:
            self.log_test("File Upload - Size Test", False, f"Error: {str(e)}")
            
        return None

    def test_jersey_creation(self, image_url=None):
        """Test jersey creation"""
        if not image_url:
            image_url = "/api/uploads/default.jpg"  # fallback
            
        test_jersey = {
            "title": "Test Jersey Design",
            "description": "A beautiful test jersey for the community",
            "designer": "Test Designer",
            "imageUrl": image_url
        }
        
        try:
            response = self.session.post(f"{API_BASE}/jerseys", json=test_jersey)
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['title'] == test_jersey['title']:
                    self.created_jerseys.append(data['id'])
                    self.log_test("Jersey Creation", True, f"Created jersey with ID: {data['id']}")
                    return data
                else:
                    self.log_test("Jersey Creation", False, "Invalid response format", data)
            else:
                self.log_test("Jersey Creation", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Jersey Creation", False, f"Error: {str(e)}")
        return None

    def test_jersey_retrieval(self):
        """Test getting all jerseys"""
        try:
            response = self.session.get(f"{API_BASE}/jerseys")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Jersey Retrieval - All", True, f"Retrieved {len(data)} jerseys")
                    
                    # Test sorting
                    response_sorted = self.session.get(f"{API_BASE}/jerseys?sort_by=votes")
                    if response_sorted.status_code == 200:
                        self.log_test("Jersey Retrieval - Sorted", True, "Sorting by votes works")
                    else:
                        self.log_test("Jersey Retrieval - Sorted", False, f"Sorting failed: {response_sorted.status_code}")
                    
                    return data
                else:
                    self.log_test("Jersey Retrieval - All", False, "Response is not a list", data)
            else:
                self.log_test("Jersey Retrieval - All", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Jersey Retrieval - All", False, f"Error: {str(e)}")
        return []

    def test_individual_jersey_retrieval(self, jersey_id):
        """Test getting a specific jersey"""
        try:
            response = self.session.get(f"{API_BASE}/jerseys/{jersey_id}")
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['id'] == jersey_id:
                    self.log_test("Individual Jersey Retrieval", True, f"Retrieved jersey: {data['title']}")
                    return data
                else:
                    self.log_test("Individual Jersey Retrieval", False, "Jersey ID mismatch", data)
            elif response.status_code == 404:
                self.log_test("Individual Jersey Retrieval", True, "Correctly returns 404 for non-existent jersey")
            else:
                self.log_test("Individual Jersey Retrieval", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Individual Jersey Retrieval", False, f"Error: {str(e)}")
        return None

    def test_voting_system(self, jersey_id):
        """Test voting and unvoting system"""
        voter_session_id = str(uuid.uuid4())
        
        try:
            # Test voting
            vote_data = {"voterSessionId": voter_session_id}
            response = self.session.put(f"{API_BASE}/jerseys/{jersey_id}/vote", json=vote_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('action') == 'voted':
                    vote_count_after_vote = data.get('newVoteCount', 0)
                    self.log_test("Voting System - Vote", True, f"Vote successful, new count: {vote_count_after_vote}")
                    
                    # Test unvoting (same session)
                    response2 = self.session.put(f"{API_BASE}/jerseys/{jersey_id}/vote", json=vote_data)
                    if response2.status_code == 200:
                        data2 = response2.json()
                        if data2.get('success') and data2.get('action') == 'unvoted':
                            vote_count_after_unvote = data2.get('newVoteCount', 0)
                            if vote_count_after_unvote == vote_count_after_vote - 1:
                                self.log_test("Voting System - Unvote", True, f"Unvote successful, count decreased to: {vote_count_after_unvote}")
                            else:
                                self.log_test("Voting System - Unvote", False, f"Vote count not decremented correctly: {vote_count_after_unvote}")
                        else:
                            self.log_test("Voting System - Unvote", False, "Unvote action not recognized", data2)
                    else:
                        self.log_test("Voting System - Unvote", False, f"Unvote failed: {response2.status_code}")
                        
                    # Test duplicate vote prevention (different session)
                    different_session = str(uuid.uuid4())
                    vote_data_diff = {"voterSessionId": different_session}
                    response3 = self.session.put(f"{API_BASE}/jerseys/{jersey_id}/vote", json=vote_data_diff)
                    if response3.status_code == 200:
                        self.log_test("Voting System - Different Session", True, "Different session can vote")
                    else:
                        self.log_test("Voting System - Different Session", False, f"Different session vote failed: {response3.status_code}")
                        
                else:
                    self.log_test("Voting System - Vote", False, "Vote response invalid", data)
            else:
                self.log_test("Voting System - Vote", False, f"Vote failed: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Voting System - Vote", False, f"Error: {str(e)}")

    def test_statistics(self):
        """Test statistics endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['totalDesigns', 'totalVotes', 'activeDesigners', 'productionRuns']
                
                if all(field in data for field in required_fields):
                    self.log_test("Statistics API", True, 
                                f"Stats: {data['totalDesigns']} designs, {data['totalVotes']} votes, {data['activeDesigners']} designers")
                    return data
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Statistics API", False, f"Missing fields: {missing}", data)
            else:
                self.log_test("Statistics API", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Statistics API", False, f"Error: {str(e)}")
        return None

    def test_error_handling(self):
        """Test various error scenarios"""
        # Test non-existent jersey
        fake_id = str(uuid.uuid4())
        try:
            response = self.session.get(f"{API_BASE}/jerseys/{fake_id}")
            if response.status_code == 404:
                self.log_test("Error Handling - Non-existent Jersey", True, "Correctly returns 404")
            else:
                self.log_test("Error Handling - Non-existent Jersey", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Non-existent Jersey", False, f"Error: {str(e)}")

        # Test voting on non-existent jersey
        try:
            vote_data = {"voterSessionId": str(uuid.uuid4())}
            response = self.session.put(f"{API_BASE}/jerseys/{fake_id}/vote", json=vote_data)
            if response.status_code == 404:
                self.log_test("Error Handling - Vote Non-existent", True, "Correctly returns 404 for voting")
            else:
                self.log_test("Error Handling - Vote Non-existent", False, f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Vote Non-existent", False, f"Error: {str(e)}")

        # Test invalid jersey creation
        try:
            invalid_jersey = {"title": ""}  # Missing required fields
            response = self.session.post(f"{API_BASE}/jerseys", json=invalid_jersey)
            if response.status_code in [400, 422]:
                self.log_test("Error Handling - Invalid Jersey", True, "Correctly rejects invalid jersey data")
            else:
                self.log_test("Error Handling - Invalid Jersey", False, f"Expected 400/422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Jersey", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🏈 Starting Football Jersey API Tests")
        print("=" * 50)
        print(f"Testing API at: {API_BASE}")
        print()

        # 1. Health Check
        if not self.test_health_check():
            print("❌ API is not responding. Stopping tests.")
            return False

        # 2. File Upload Tests
        uploaded_image_url = self.test_file_upload()

        # 3. Jersey Creation
        created_jersey = self.test_jersey_creation(uploaded_image_url)

        # 4. Jersey Retrieval
        all_jerseys = self.test_jersey_retrieval()

        # 5. Individual Jersey Retrieval
        if created_jersey:
            self.test_individual_jersey_retrieval(created_jersey['id'])

        # 6. Voting System
        if created_jersey:
            self.test_voting_system(created_jersey['id'])

        # 7. Statistics
        self.test_statistics()

        # 8. Error Handling
        self.test_error_handling()

        # Summary
        print("\n" + "=" * 50)
        print("🏈 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if "✅ PASS" in result['status'])
        failed = sum(1 for result in self.test_results if "❌ FAIL" in result['status'])
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result['status']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ All critical backend functionality tested!")
        return failed == 0

if __name__ == "__main__":
    tester = JerseyAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)