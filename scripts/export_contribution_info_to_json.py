import pandas
from os import path, chdir, makedirs

chdir("../downloads/")
CONTRIBUTION_NAMES = ["A-Contributions", "C-Contributions", "I-Contributions"]
EXPENDITURE_NAMES = ["D-Expenditure", "G-Expenditure", "E-Expenditure"]


def load_sheets_from_years(years, sheet_names):
    '''
    Returns the specified sheets of the given year(s) (e.g 2020).
    A list of the years and the sheet names are the argruments
    '''
    sheets = []
    for year in years:
        for sheet in sheet_names:
            sheets.append(pandas.read_excel("static/efile_SD_CSD_"
                                            + str(year)+".xlsx", sheet))
    return sheets


def sum_of_sheet_columns(summed_column, *args):
    '''
    returns sum of columns of the specified name on specified sheets
    Takes *args of sheets and a string of the column name
    '''
    total = 0
    for sheet in args:
        total += sheet[summed_column].sum()
    return total


def unique_sheet_columns_sum(identifier_column, summed_column, *args):
    '''
    returns pandas series with the sum each identifier's column
    combined from every sheet. If the identifier from the column is a
    string, takes the lower case form of that string. Takes *args of
    sheets and a string of the column name and the identifier column
    '''
    dict_totals = {}
    for sheet in args:
        for c, identifier in enumerate(sheet[identifier_column]):
            try:
                identifier = identifier.lower()
            except AttributeError:
                pass
            if dict_totals.get(identifier) is None:
                dict_totals.update({identifier: sheet[summed_column].iloc[c]})
            else:
                num = dict_totals.get(identifier)+sheet[summed_column].iloc[c]
                dict_totals.update({identifier: num})
    return pandas.Series(dict_totals)


if __name__ == '__main__':
    contribution_sheets = load_sheets_from_years([2019, 2020], CONTRIBUTION_NAMES)
    expenditure_sheets = load_sheets_from_years([2019, 2020], EXPENDITURE_NAMES)

    total_contributions = sum_of_sheet_columns("Tran_Amt2", *contribution_sheets)
    total_expenditures = sum_of_sheet_columns("Amount", *expenditure_sheets)
    expenditures_by_zip = unique_sheet_columns_sum("Tran_Zip4", "Tran_Amt2",
                                                   *contribution_sheets)
    expenditures_by_occupation = unique_sheet_columns_sum("Tran_Occ", "Tran_Amt2",
                                                          *contribution_sheets)

    if not path.exists("raw/"):
        makedirs("raw/")

    expenditures_by_zip.to_json("raw/expenditures_by_zip.json")
    expenditures_by_occupation.to_json("raw/expenditures_by_occupation.json",
                                       orient="columns")

    series_total_contributions = pandas.Series(total_contributions,
                                               index=["total_contributions"])
    series_total_contributions.to_json("raw/total_contributions.json")

    series_total_expenditures = pandas.Series(total_expenditures,
                                              index=["total_expenditures"])
    series_total_expenditures.to_json("raw/total_expenditures.json")
