import { defineStore } from "pinia";
import { loginWithGoogle, logout as firebaseLogout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // maybe not even necessary
    isAllowed: false,
    // isActive: false,
    roles: [],
    currentRole: "",
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async loginWithGoogle() {
        const loggedUser = await loginWithGoogle();
        if (!loggedUser) return;
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: loggedUser.idToken }),
          });
  
          const data = await response.json();

          if(!data.isAllowed){
            alert("Neatļauts domēns!");
            return;
          }
          if(!data.isActive){
            alert("Deaktivizēts lietotājs!");
            return;
          }

          if (!response.ok) throw new Error("Failed to verify login");

          this.setUserSession(data);

        } catch (error) {
          console.error("Login error:", error);
        }
    },
    async loginWithUsername(username, password) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error("Invalid username or password");

        const data = await response.json();
        // if(!data.isAllowed){
        //   alert("Neatļauts domēns vai deaktivizēts lietotājs!");
        //   return;
        // }
        if(!data.isActive){
          alert("Deaktivizēts lietotājs!");
          return;
        }
        this.setUserSession(data);
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    
    async logout() {
      this.user = null;
      this.isAllowed = false;
      this.roles = [];
      this.currentRole = "";
      this.token = null;
      localStorage.removeItem("token");

      await firebaseLogout();
    },
    
    async switchRole(newRole) {
      if (this.roles.includes(newRole)) {
        this.currentRole = newRole;
      }
    },
    setUserSession(data) {
      this.user = { email: data.email };
      console.log(this.user);
      // this.roles = data.roles;
      this.roles = Array.isArray(data.roles) ? data.roles : [];
      console.log(this.roles);
      this.isAllowed = data.isAllowed;
      console.log(this.isAllowed);
      this.currentRole = data.roles.length == 0 ? "" : data.roles[data.roles.length-1];
      console.log(this.currentRole);
      this.token = data.token;
      console.log(this.token);
      localStorage.setItem("token", data.token);
    },
    async checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Invalid token");

        this.setUserSession(data);
      } catch (error) {
        console.error("Auth check failed:", error);
        this.logout();
      }
    },
  }
});