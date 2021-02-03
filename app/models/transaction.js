'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {

    static async createMultiple(transactions) {

      transactions = Array.isArray(transactions) ? transactions : [ transactions ];

      const modelFields = [ 
        "netFileKey", "externalId", "filerLocalId", "filerStateId", "filerName", "filingId", 
        "filingStartDate", "filingEndDate", "transactionType", "calculated_Date", "calculated_Amount", 
        "amountType", "rec_Type", "form_Type", "tran_Id", "entity_Cd", "tran_NamL", "tran_NamF", 
        "tran_NamT", "tran_NamS", "tran_Adr1", "tran_Adr2", "tran_City", "tran_ST", "tran_Zip4", 
        "tran_Emp", "tran_Occ", "tran_Self", "tran_Type", "tran_Date", "tran_Date1", "tran_Amt1", 
        "tran_Amt2", "tran_Dscr", "tres_NamL", "tres_NamF", "tres_NamT", "tres_NamS", "tres_Adr1", 
        "tres_Adr2", "tres_City", "tres_ST", "tres_Zip4", "intr_NamL", "intr_NamF", "intr_NamT", 
        "intr_NamS", "intr_Adr1", "intr_Adr2", "intr_City", "intr_ST", "intr_Zip4", "intr_Emp", 
        "intr_Occ", "intr_Self", "cand_NamL", "cand_NamF", "cand_NamT", "cand_NamS", "office_Cd", 
        "office_Dscr", "juris_Cd", "juris_Dscr", "dist_No", "off_S_H_Cd", "bal_Name", "bal_Num", 
        "bal_Juris", "sup_Opp_Cd", "memo_Code", "memo_RefNo", "bakRef_TID", "xref_SchNum", 
        "xref_Match", "int_Rate", "int_CmteId", "tran_ChkNo", "tran_Code", "cmte_Id", "g_From_E_F", 
        "beg_Bal", "amt_Incur", "amt_Paid", "end_Bal", "loan_Amt1", "loan_Amt2", "loan_Amt3", 
        "loan_Amt4", "loan_Amt5", "loan_Amt6", "loan_Amt7", "loan_Amt8", "loan_Date1", "loan_Date2", 
        "loan_Rate", "lender_Name", "elec_Date", "latitude", "longitude", "vvIncludeInCalculations" 
      ];
  
      await Transaction.bulkCreate(transactions, { fields: modelFields, validate: true, ignoreDuplicates: true });

      return transactions.map(transaction => transaction.netFileKey);

    }
    
    static async setIncludeInCalculationsStatus(filingId, statusFlag) {

      const filingIds = Array.isArray(filingId) ? filingId : [ filingId ];

      await Transaction.update({
        vvIncludeInCalculations: statusFlag
      }, {
        where: {
          filingId: filingIds
        }
      });

    }

    static async setIncludedExcluded(includeFilingId, excludeFilingId = '') {

      const includeFilingIds = Array.isArray(includeFilingId) ? includeFilingId : [ includeFilingId ];
      const excludeFilingIds = Array.isArray(excludeFilingId) ? excludeFilingId : [ excludeFilingId ];

      try {

        const result = await sequelize.transaction(async (t) => {
      
          await Transaction.update({
            vvIncludeInCalculations: true
          }, {
            where: {
              filingId: includeFilingIds
            }
          }, { transaction: t });

          await Transaction.update({
            vvIncludeInCalculations: false
          }, {
            where: {
              filingId: excludeFilingIds
            }
          }, { transaction: t });

        });
      
        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback
      
      } catch (error) {
      
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
      
      }

    }


    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transaction.init({
    "netFileKey": {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    "externalId": DataTypes.STRING,
    "filerLocalId": DataTypes.STRING,
    "filerStateId": DataTypes.STRING,
    "filerName": DataTypes.STRING,
    "filingId": DataTypes.STRING,
    "filingStartDate": DataTypes.STRING,
    "filingEndDate": DataTypes.STRING,
    "transactionType": DataTypes.INTEGER,
    "calculated_Date": DataTypes.STRING,
    "calculated_Amount": DataTypes.DECIMAL,
    "amountType": DataTypes.DECIMAL,
    "rec_Type": DataTypes.STRING,
    "form_Type": DataTypes.STRING,
    "tran_Id": DataTypes.STRING,
    "entity_Cd": DataTypes.STRING,
    "tran_NamL": DataTypes.STRING,
    "tran_NamF": DataTypes.STRING,
    "tran_NamT": DataTypes.STRING,
    "tran_NamS": DataTypes.STRING,
    "tran_Adr1": DataTypes.STRING,
    "tran_Adr2": DataTypes.STRING,
    "tran_City": DataTypes.STRING,
    "tran_ST": DataTypes.STRING,
    "tran_Zip4": DataTypes.STRING,
    "tran_Emp": DataTypes.STRING,
    "tran_Occ": DataTypes.STRING,
    "tran_Self": DataTypes.BOOLEAN,
    "tran_Type": DataTypes.STRING,
    "tran_Date": DataTypes.STRING,
    "tran_Date1": DataTypes.STRING,
    "tran_Amt1": DataTypes.DECIMAL,
    "tran_Amt2": DataTypes.DECIMAL,
    "tran_Dscr": DataTypes.STRING,
    "tres_NamL": DataTypes.STRING,
    "tres_NamF": DataTypes.STRING,
    "tres_NamT": DataTypes.STRING,
    "tres_NamS": DataTypes.STRING,
    "tres_Adr1": DataTypes.STRING,
    "tres_Adr2": DataTypes.STRING,
    "tres_City": DataTypes.STRING,
    "tres_ST": DataTypes.STRING,
    "tres_Zip4": DataTypes.STRING,
    "intr_NamL": DataTypes.STRING,
    "intr_NamF": DataTypes.STRING,
    "intr_NamT": DataTypes.STRING,
    "intr_NamS": DataTypes.STRING,
    "intr_Adr1": DataTypes.STRING,
    "intr_Adr2": DataTypes.STRING,
    "intr_City": DataTypes.STRING,
    "intr_ST": DataTypes.STRING,
    "intr_Zip4": DataTypes.STRING,
    "intr_Emp": DataTypes.STRING,
    "intr_Occ": DataTypes.STRING,
    "intr_Self": DataTypes.BOOLEAN,
    "cand_NamL": DataTypes.STRING,
    "cand_NamF": DataTypes.STRING,
    "cand_NamT": DataTypes.STRING,
    "cand_NamS": DataTypes.STRING,
    "office_Cd": DataTypes.STRING,
    "office_Dscr": DataTypes.STRING,
    "juris_Cd": DataTypes.STRING,
    "juris_Dscr": DataTypes.STRING,
    "dist_No": DataTypes.STRING,
    "off_S_H_Cd": DataTypes.STRING,
    "bal_Name": DataTypes.STRING,
    "bal_Num": DataTypes.STRING,
    "bal_Juris": DataTypes.STRING,
    "sup_Opp_Cd": DataTypes.STRING,
    "memo_Code": DataTypes.BOOLEAN,
    "memo_RefNo": DataTypes.STRING,
    "bakRef_TID": DataTypes.STRING,
    "xref_SchNum": DataTypes.STRING,
    "xref_Match": DataTypes.BOOLEAN,
    "int_Rate": DataTypes.DECIMAL,
    "int_CmteId": DataTypes.STRING,
    "tran_ChkNo": DataTypes.STRING,
    "tran_Code": DataTypes.STRING,
    "cmte_Id": DataTypes.STRING,
    "g_From_E_F": DataTypes.STRING,
    "beg_Bal": DataTypes.DECIMAL,
    "amt_Incur": DataTypes.DECIMAL,
    "amt_Paid": DataTypes.DECIMAL,
    "end_Bal": DataTypes.DECIMAL,
    "loan_Amt1": DataTypes.DECIMAL,
    "loan_Amt2": DataTypes.DECIMAL,
    "loan_Amt3": DataTypes.DECIMAL,
    "loan_Amt4": DataTypes.DECIMAL,
    "loan_Amt5": DataTypes.DECIMAL,
    "loan_Amt6": DataTypes.DECIMAL,
    "loan_Amt7": DataTypes.DECIMAL,
    "loan_Amt8": DataTypes.DECIMAL,
    "loan_Date1": DataTypes.STRING,
    "loan_Date2": DataTypes.STRING,
    "loan_Rate": DataTypes.STRING,
    "lender_Name": DataTypes.STRING,
    "elec_Date": DataTypes.STRING,
    "latitude": DataTypes.DECIMAL,
    "longitude": DataTypes.DECIMAL,
    vvIncludeInCalculations: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    indexes: [{ fields: ['filingId', 'filerName'] }]
  });
  return Transaction;
};
