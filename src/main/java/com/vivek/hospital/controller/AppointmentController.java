
package com.vivek.hospital.controller;

import com.vivek.hospital.model.Appointment;
import com.vivek.hospital.repository.AppointmentRepository;
import com.vivek.hospital.repository.PatientRepository;
import com.vivek.hospital.repository.DoctorRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<String> bookAppointment(
            @RequestBody Appointment appointment) {

        if (!patientRepository.existsById(appointment.getPatientId())) {
            return ResponseEntity.badRequest()
                    .body("Patient does not exist");
        }

        if (!doctorRepository.existsById(appointment.getDoctorId())) {
            return ResponseEntity.badRequest()
                    .body("Doctor does not exist");
        }

        if (appointment.getAppointmentDate() == null) {
            return ResponseEntity.badRequest()
                    .body("Appointment date is required");
        }

        if (appointmentRepository.existsByDoctorIdAndAppointmentDate(
                appointment.getDoctorId(),
                appointment.getAppointmentDate())) {

            return ResponseEntity.badRequest()
                    .body("Doctor is not available on this date");
        }

        appointment.setId(null);
        appointmentRepository.save(appointment);

        return ResponseEntity.ok("Appointment booked successfully");
    }
}
