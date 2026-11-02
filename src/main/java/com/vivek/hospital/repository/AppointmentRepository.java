package com.vivek.hospital.repository;

import com.vivek.hospital.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    boolean existsByDoctorIdAndAppointmentDate(
            Integer doctorId,
            LocalDate appointmentDate
    );
}
