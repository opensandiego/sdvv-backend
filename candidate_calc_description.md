Google drive - https://docs.google.com/spreadsheets/d/1mENueYg0PhXE_MA9AypWWBJvBLdY03b8H_N_aIW-Ohw/edit#gid=0

* candidate name:
  1. taken from google drive spreadsheet named "candidate_information" column "Candidate_Name"

* description:
  1. taken from google drive spreadsheet named "candidate_information" column "Description"

* website:
  1. taken from google drive spreadsheet named "candidate_information" column "Website"

* "raised":
  1. taken from efile_CSD_2020.xlsx. Look at
the A-Contributions, C-Contributions, I-Contributions sheets
  2. Filter by "Committee Name (Filer_Name)" which is found in the google drive spreadsheet 
  3. There is a Tran_Amt2 column. Take the sum of each sheet and add them together

* "spent" - similar to raise.
  1. Use efile_CSD_2020.xlsx at look at all sheets D-Expenditure, G-Expenditure, E-Expenditure sheets. 
  2. Filter by "Committee Name (Filer_Name)" which is found in the google drive spreadsheet 
  3. There is an Amount column, sum the total for each sheet

* "donors" - Taken from efile_CSD_2020.xlsx.
  1. Look at the A-Contributions, C-Contributions and I-Contributions sheets.
  2. Filter by "Committee Name (Filer_Name)" which is found in the google drive spreadsheet 
  3. There are two columns, Tran_NameL and Tran_NameF, combine the two columns
  4. Find all unique donors and output the total number of unique values.

* "by industry" - Taken from efile_CSD_2020.xlsx.   
  1. Look at the A-Contributions, C-Contributions and I-Contributions sheet.
  2. Filter by "Committee Name (Filer_Name)" which is found in the google drive spreadsheet 
  3. Find all unique values in Tran_Emp column.
  4. Sum all values for each unique value.
  5. Take the top 5 values sorted by most contributions.
  6. Output the Tran_Emp name, total amount from Tran_Emp and the percent of money over total contributions for this candidate.

* Oppose - TBD
* Support - TBD
