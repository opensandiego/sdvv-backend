from pandas import read_csv
from os import path, makedirs, chdir
from math import isnan

chdir("..")
SD_CANDIDATES = read_csv("downloads/csv/sd_candidates.csv")
FILE_PATH = "build/_candidates/sandiego/"


def dict_to_md(file_path, dictionary):
    '''
    Write a dictionary to a markdown file formated "key: value"
    If the directories in the path doesn't exist, it creates them.
    Assumes path has no associated file extension
    '''
    file_path += ".md"
    directory, dict_md = path.split(file_path)
    if not path.exists(directory):
        makedirs(directory)
    with open(file_path, mode="w") as f:
        for key in dictionary:
            print(key, dictionary[key], sep=": ", file=f)


def remove_NaN(dictionary):
    '''
    Takes a dictionary and replaces NaN values with empty strings
    '''
    for key in dictionary:
        try:
            if isnan(dictionary[key]):
                dictionary[key] = ""
        except TypeError:
            pass


candidate_dict = SD_CANDIDATES.transpose().to_dict()
for candidate_info in candidate_dict.values():
    remove_NaN(candidate_info)
    candidate_path = path.join(FILE_PATH, candidate_info["Candidate_Name"])
    dict_to_md(candidate_path, candidate_info)


# NOTE:
# I should submit two pull requests, one for the old task and one for the new
