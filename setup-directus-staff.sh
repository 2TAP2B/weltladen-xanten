#!/bin/bash

# Directus Staff Members Collection Setup Script
# Make sure to set DIRECTUS_TOKEN environment variable before running

DIRECTUS_URL="https://ewgx.steltner.cc"

# Check if token is set
if [ -z "$DIRECTUS_TOKEN" ]; then
    echo "❌ Error: DIRECTUS_TOKEN environment variable is not set"
    echo "Please set it with: export DIRECTUS_TOKEN=your_token_here"
    exit 1
fi

echo "🔍 Testing Directus connection..."

# Test basic connection
response=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET "$DIRECTUS_URL/collections" -H "Authorization: Bearer $DIRECTUS_TOKEN")
http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$http_code" != "200" ]; then
    echo "❌ Connection test failed (HTTP $http_code)"
    echo "Response: $(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')"
    echo ""
    echo "This usually means:"
    echo "1. The token doesn't have admin permissions"
    echo "2. The token is invalid or expired"
    echo "3. The API endpoint is not accessible"
    echo ""
    echo "🔧 Manual setup required - please use the Directus admin interface"
    echo "📋 See DIRECTUS_STAFF_SETUP.md for detailed instructions"
    exit 1
fi

echo "✅ Connection successful!"

# Check if staff_members collection exists
echo "🔍 Checking if staff_members collection exists..."
response=$(curl -s -w "HTTP_CODE:%{http_code}" -X GET "$DIRECTUS_URL/items/staff_members?limit=1" -H "Authorization: Bearer $DIRECTUS_TOKEN")
http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$http_code" = "200" ]; then
    echo "✅ staff_members collection already exists!"
    echo "📊 Testing data retrieval..."
    
    # Get count of staff members
    count_response=$(curl -s -X GET "$DIRECTUS_URL/items/staff_members?aggregate[count]=id" -H "Authorization: Bearer $DIRECTUS_TOKEN")
    echo "Response: $count_response"
    exit 0
fi

echo "📦 staff_members collection doesn't exist yet"
echo "🚀 Attempting to create collection..."

# Try to create the collection
response=$(curl -s -w "HTTP_CODE:%{http_code}" -X POST "$DIRECTUS_URL/collections" \
    -H "Authorization: Bearer $DIRECTUS_TOKEN" \
    -H "Content-Type: application/json" \
    -d @directus-staff-collection.json)

http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
    echo "✅ Collection created successfully!"
    echo "📝 You can now add staff members through the Directus admin interface"
else
    echo "❌ Failed to create collection (HTTP $http_code)"
    echo "Response: $(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')"
    echo ""
    echo "🔧 Manual setup required"
    echo "📋 Please follow the instructions in DIRECTUS_STAFF_SETUP.md"
    echo "🎯 Use the directus-staff-collection.json file for reference"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Open Directus admin: $DIRECTUS_URL"
echo "2. Navigate to Settings > Data Model"
echo "3. Create the staff_members collection manually if needed"
echo "4. Add some test staff members"
echo "5. Visit /mitarbeiter on your website to see the results"