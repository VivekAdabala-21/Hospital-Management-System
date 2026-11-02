package com.vivek.hospital.controller;

import com.vivek.hospital.repository.PatientRepository;
import com.vivek.hospital.repository.DoctorRepository;
import com.vivek.hospital.repository.AppointmentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {

        return Map.of(
                "totalPatients", patientRepository.count(),
                "totalDoctors", doctorRepository.count(),
                "totalAppointments", appointmentRepository.count()
        );
    }
}
