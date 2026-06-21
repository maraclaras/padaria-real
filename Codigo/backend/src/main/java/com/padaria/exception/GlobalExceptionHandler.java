package com.padaria.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException error) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", error.getMessage()
        ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(DataIntegrityViolationException error) {
        return ResponseEntity.badRequest().body(Map.of(
                "message", "Não foi possível salvar. Verifique se os dados não estão duplicados."
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception error) {
        error.printStackTrace();

        return ResponseEntity.badRequest().body(Map.of(
                "message", error.getMessage() != null
                        ? error.getMessage()
                        : "Erro inesperado ao processar solicitação."
        ));
    }
}