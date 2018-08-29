package main

import (
	"github.com/labstack/echo"
	"github.com/ubertrip/partner-system/controllers"
	"github.com/ubertrip/partner-system/repositories"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods:  []string{"GET", "POSt", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	repositories.InitDB()

	e.GET("/", controllers.Info)
	e.POST("/payments", controllers.UpdateWeeklyPayments)

	e.Logger.Fatal(e.Start(":1323"))
}