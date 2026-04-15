import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's tickets
  const fetchUserTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets/user", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message);
      console.error("[useTickets] Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all tickets (admin)
  const fetchAllTickets = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets/admin/all", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setTickets(data.tickets || []);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
      console.error("[useTickets] Error fetching admin:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get single ticket
  const getTicket = useCallback(async (ticketId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setCurrentTicket(data.ticket);
      return data.ticket;
    } catch (err) {
      setError(err.message);
      console.error("[useTickets] Error getting ticket:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create ticket
  const createTicket = useCallback(
    async (ticketData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tickets/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(ticketData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create ticket");
        }

        const data = await res.json();
        setTickets([data.ticket, ...tickets]);
        return data.ticket;
      } catch (err) {
        setError(err.message);
        console.error("[useTickets] Error creating:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tickets]
  );

  // Update status (admin)
  const updateStatus = useCallback(async (ticketId, status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ticketId, status }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setTickets(tickets.map(t => (t.id === ticketId ? data.ticket : t)));
      if (currentTicket?.id === ticketId) setCurrentTicket(data.ticket);
      return data.ticket;
    } catch (err) {
      setError(err.message);
      console.error("[useTickets] Error updating status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tickets, currentTicket]);

  // Add note (admin)
  const addNote = useCallback(
    async (ticketId, note) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tickets/add-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ticketId, note }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setTickets(tickets.map(t => (t.id === ticketId ? data.ticket : t)));
        if (currentTicket?.id === ticketId) setCurrentTicket(data.ticket);
        return data.ticket;
      } catch (err) {
        setError(err.message);
        console.error("[useTickets] Error adding note:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tickets, currentTicket]
  );

  return {
    tickets,
    currentTicket,
    stats,
    loading,
    error,
    fetchUserTickets,
    fetchAllTickets,
    getTicket,
    createTicket,
    updateStatus,
    addNote,
  };
};
