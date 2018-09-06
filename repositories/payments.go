package repositories

import (
	"github.com/ubertrip/partner-system/models"
	"strings"
	"fmt"
)

func UpdateWeekly(payments []models.WeeklyPayment) (ok bool) {
	values := make([]interface{}, 0, len(payments)*7)
	str := ""

	for _, payment := range payments {
		str += "(?, ?, ?, ?, ?, ?, ?),"
		values = append(values, payment.PaymentUuid, payment.DriverUuid, payment.CashCollected, payment.Incentives, payment.MiscPayment, payment.NetFares, payment.NetPayout)
	}

	str = strings.TrimRight(str, ",")

	_, err := Get().Exec("INSERT INTO `weekly-payments` (paymentUuid, driverUuid, cashCollected, incentives, miscPayment, netFares, netPayout) "+
		"VALUES "+ str+ " ON DUPLICATE KEY UPDATE cashCollected=VALUES(cashCollected), incentives=VALUES(incentives), miscPayment=VALUES(miscPayment), netFares=VALUES(netFares), netPayout=VALUES(netPayout)", values...)

	if err != nil {
		fmt.Println(err)
		ok = false
		return
	}

	ok = true

	return
}

func UpdateStatements(statements []models.Statement) (ok bool) {
	values := make([]interface{}, 0, len(statements)*7)
	str := ""

	for _, statement := range statements {
		str += "(?, ?, ?, ?, ?, ?, ?),"
		values = append(values, statement.Uuid, statement.IsPaid, statement.CurrencyCode, statement.StartAt, statement.EndAt, statement.Total, statement.Timezone)
	}

	str = strings.TrimRight(str, ",")

	_, err := Get().Exec("INSERT INTO `statements` (uuid, isPaid, currencyCode, startAt, endAt, total, timezone) "+
		"VALUES "+ str+ " ON DUPLICATE KEY UPDATE isPaid=VALUES(isPaid), total=VALUES(total), endAt=VALUES(endAt)", values...)

	if err != nil {
		fmt.Println(err)
		ok = false
		return
	}

	ok = true

	return
}

func AddPayment(p models.Payment) (ok bool) {
	_, err := Get().Exec("INSERT INTO payments (uuid, driverUuid, createdBy, credit, statementUuid) VALUES (?, ?, 'system', ?, ?)",
		p.PaymentUuid, p.DriverUuid, p.Credit, p.StatementUuid)

	if err != nil {
		fmt.Println(err)
		ok = false
		return
	}

	ok = true

	return
}

func GetDriverPaymetListByStatementId(statementUuid string, driverUuid string) (payments []models.Payment, err error) {
	rows, err := Get().Query("SELECT uuid, credit, driverUuid, createdAt, createdBy, statementUuid FROM `payments` WHERE statementUuid = ? and driverUuid = ? ORDER BY createdAt DESC", statementUuid, driverUuid)

	if err != nil {
		fmt.Println(err)
		return payments, err
	}

	for rows.Next() {
		payment := models.Payment{}
		errRow := rows.Scan(
			&payment.PaymentUuid,
			&payment.Credit,
			&payment.DriverUuid,
			&payment.CreatedAt,
			&payment.CreatedBy,
			&payment.StatementUuid)

		if errRow != nil {
			continue
		}

		payments = append(payments, payment)
	}

	return payments, err
}

func GetStatements() (statements []models.Statement, err error) {
	rows, err := Get().Query("SELECT uuid, isPaid, currencyCode, startAt, endAt, total, timezone, hidden FROM `statements` ORDER by startAt DESC")

	if err != nil {
		return statements, err
	}

	for rows.Next() {
		statement := models.Statement{}
		errRow := rows.Scan(
			&statement.Uuid,
			&statement.IsPaid,
			&statement.CurrencyCode,
			&statement.StartAt,
			&statement.EndAt,
			&statement.Total,
			&statement.Timezone,
			&statement.Hidden)

		if errRow != nil {
			continue
		}

		statements = append(statements, statement)
	}

	return statements, err
}

func GetDriverWeeklyPayment(statementUUID string, driverUUID string) (weeklyPayment models.WeeklyPayment, err error) {
	err = Get().QueryRow("SELECT paymentUuid, driverUuid, cashCollected, incentives, miscPayment, netFares, netPayout FROM `weekly-payments` WHERE paymentUuid = ? and driverUuid = ?", statementUUID, driverUUID).Scan(
		&weeklyPayment.PaymentUuid,
		&weeklyPayment.DriverUuid,
		&weeklyPayment.CashCollected,
		&weeklyPayment.Incentives,
		&weeklyPayment.MiscPayment,
		&weeklyPayment.NetFares,
		&weeklyPayment.NetPayout)

	if err != nil {
		return weeklyPayment, err
	}

	return weeklyPayment, err
}

func GetPaymentsByStatement(statementUUID string) (payments []models.Payment, err error) {
	rows, err := Get().Query("SELECT uuid, driverUuid, createdAt, credit, createdBy, statementUuid FROM `payments` WHERE statementUuid = ? ORDER BY createdAt DESC", statementUUID)

	if err != nil {
		return payments, err
	}

	for rows.Next() {
		payment := models.Payment{}
		errRow := rows.Scan(
			&payment.PaymentUuid,
			&payment.DriverUuid,
			&payment.CreatedAt,
			&payment.Credit,
			&payment.CreatedAt,
			&payment.StatementUuid)

		if errRow != nil {
			continue
		}

		payments = append(payments, payment)
	}

	return payments, err
}

func GetWeeklyPaymentsByStatement(statementUUID string) (payments []models.WeeklyPayment, err error) {
	rows, err := Get().Query("SELECT paymentUuid, driverUuid, cashCollected, incentives, miscPayment, netFares, netPayout FROM `weekly-payments` WHERE paymentUuid = ?", statementUUID)

	if err != nil {
		return payments, err
	}

	for rows.Next() {
		payment := models.WeeklyPayment{}
		errRow := rows.Scan(
			&payment.PaymentUuid,
			&payment.DriverUuid,
			&payment.CashCollected,
			&payment.Incentives,
			&payment.MiscPayment,
			&payment.NetFares,
			&payment.NetPayout)

		if errRow != nil {
			continue
		}

		payments = append(payments, payment)
	}

	return payments, err
}
