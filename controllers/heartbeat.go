package controllers

import (
	"github.com/labstack/echo"
	// "fmt"
	// "net/http"
	"encoding/json"
	// "github.com\ubertrip\partner-system\controllers"
	"github.com/ubertrip/partner-system/repositories"
	"golang.org/x/crypto/bcrypt"
	"fmt"
	// "database/sql"
)

func Info(c echo.Context) error {
	info := struct{
		Name string `json:"name"`
	}{"partner system v0.0"}
	return JsonResponseOk(c, info)
}
	

type LoginForm struct {
	Login  string `json:"login" form:"login" query:"login"`
	Password string `json:"password" form:"password" query:"password"`
}

type Menu struct {
	Menu  string `json:"Menu" `
	
}

type LoginStatus struct {
	Status bool `json:"status"`
}
	
func Login(c echo.Context) error {
	var loginForm LoginForm

	json.NewDecoder(c.Request().Body).Decode(&loginForm)

	var resp LoginStatus

	resp.Status = repositories.GetUserByLogin(loginForm.Login, loginForm.Password)

	if !resp.Status {
		return JsonResponseErr(c, resp.Status)
	}
	
	return JsonResponseOk(c, resp)
}

const (
	defaultCost = 12
   )
func init() {
	pwd := "123"
	hash := HashPassword(pwd)
	fmt.Println(pwd, hash)
	fmt.Println(CheckPassword(pwd, hash))
	fmt.Println(CheckPassword(pwd, "$2a$12$yEm8VP3E8t6i6wzcA4AlgOK8olCf0/CTA0GiwYOc5B10Cn6htWA5K"))
}   

func HashPassword(password string) string {
	if hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), defaultCost); err == nil {
		return string(hashedPassword)
	}
	return ""
}

func CheckPassword(password, hashedPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) == nil
}
