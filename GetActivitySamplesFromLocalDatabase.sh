#!/bin/bash


# Prompt the user for the database password
echo "Enter the database password:"
read -s password

# Set the PGPASSWORD environment variable
export PGPASSWORD=$password

# Get all users from the "_User" table and save to a temporary file
#/Library/PostgreSQL/15/bin/psql -U postgres -p 5432 -d postgres -c "\copy (SELECT \"objectId\" FROM \"_User\") to '/tmp/users.txt';" 
/Library/PostgreSQL/15/bin/psql -U postgres -p 5432 -d postgres -c  "COPY (
  SELECT u.\"objectId\"
  FROM \"_User\" u
  JOIN \"StudyData\" s ON u.\"objectId\" = s.user
  WHERE s.\"currentState\" = 'FreeLiving'
) TO STDOUT ;" > "./users.txt"


# Loop through the list of users
while read user_id
do
    # Create a file name for the user
    file_name="${user_id}_activity_log.csv"

    # Get all rows from the ActivityLogBlockSample table for the user and save to a CSV file
    /Library/PostgreSQL/15/bin/psql -U postgres -p 5432 -d postgres -c "\copy (SELECT * FROM \"ActivityLogBlockSample\" WHERE \"user\" = '${user_id}') to '${file_name}' csv header;"

    # Move the CSV file to the local machine
    mv ${file_name} /Users/luiscarvalho/activitySampleBlocks/
done < ./users.txt

# Remove the temporary file
rm ./users.txt

# Unset the PGPASSWORD environment variable
unset PGPASSWORD

# Inform the user that the script has finished
echo "Done."