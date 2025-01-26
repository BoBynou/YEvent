import { createClient } from '@supabase/supabase-js';

class DataBase {
    constructor() {
        this.supabaseUrl = 'https://uxlkkmbgssvihdvjauyr.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bGtrbWJnc3N2aWhkdmphdXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NDgxODMsImV4cCI6MjA1MzAyNDE4M30.AgJtRNSDnMhmzpVDVqDy7qfukNS_ihhEF7QoKADb4Co';
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    async getData(table) {
        const { data, error } = await this.supabase
            .from(table)
            .select('*');
        if (error) {
            throw error;
        }
        return data;
    }

    async insertData(table, newData) {
        console.log(table, newData);
        const { data, error } = await this.supabase
            .from(table)
            .insert(newData);
        if (error) {
            throw error;
        }
        console.log('data', data);
        return data;
    }

    async updateData(table, id, updatedData) {
        const { data, error } = await this.supabase
            .from(table)
            .update(updatedData)
            .eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    }

    async deleteData(table, id) {
        const { data, error } = await this.supabase
            .from(table)
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    }

    async getConcerts() {
        const { data, error } = await this.supabase
            .from('concerts')
            .select('*');
        if (error) {
            throw error;
        }
        return data;
    }

    async getUserById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw error;
        }
        return data;
    }

    async getUserConcerts(userId) {
        const { data: reservations, error: reservationsError } = await this.supabase
            .from('reservations')
            .select('*, concerts(*)')
            .eq('userid', userId);
        if (reservationsError) {
            throw reservationsError;
        }
        if (!reservations || reservations.length === 0) {
            return [];
        }

        const concerts = reservations.map(reservation => ({
            ...reservation.concerts,
            reservationId: reservation.reservationid,
            tickets: reservation.tikets
        }));

        return concerts;
    }

    async getUserIdByEmail(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        console.log(error);
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return data.id;
    }

    // async getReservationByConcertAndUser(concertId, userId) {
    //     const { data, error } = await this.supabase
    //         .from('reservations')
    //         .select('*')
    //         .eq('concertid', concertId)
    //         .eq('userid', userId)
    //         .single();
    //     if (error) {
    //         throw error;
    //     }
    //     return data;
    // }
}

export default DataBase;
