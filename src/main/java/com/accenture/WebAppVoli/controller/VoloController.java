package com.accenture.WebAppVoli.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.accenture.WebAppVoli.dto.VoloDto;
import com.accenture.WebAppVoli.exception.BadRequestException;
import com.accenture.WebAppVoli.model.Volo;
import com.accenture.WebAppVoli.service.VoloService;

@RestController
@CrossOrigin(origins = "*")
public class VoloController {

    @Autowired
    private VoloService voloService;

    @PostMapping("/voli")
    public Volo save(@RequestBody @Validated VoloDto voloDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(e->e.getDefaultMessage()).collect(Collectors.joining(", ")));
        }
        return voloService.save(voloDto);
    }

    @PutMapping("/voli/{id}")
    public Volo update(@PathVariable Integer id, @RequestBody @Validated VoloDto voloDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(e->e.getDefaultMessage()).collect(Collectors.joining(", ")));
        } 
        return voloService.update(id, voloDto);
    }

    @DeleteMapping("/voli/{id}")
    public void delete(@PathVariable Integer id){
        voloService.delete(id);
    }

    @GetMapping("/voli/{id}")
    public Volo getById(@PathVariable Integer id){
        return voloService.getById(id);
    }
    
    @GetMapping("/voli")
    public List<Volo> getAll(){
        return voloService.getAll();
    }

    // per la ricerca in base hai parametri sottostanti
    // required = false vuol dire che il valore può essere omesso
    @GetMapping("/voli/ricerca")
    public List<Volo> ricerca(
            @RequestParam(required = false) String aeroportoPartenza,
            @RequestParam(required = false) String aeroportoDestinazione,
            @RequestParam(required = false) LocalDate data,
            @RequestParam(required = false) String compagnia){

        return voloService.ricerca(aeroportoPartenza, aeroportoDestinazione, data, compagnia);
    }

}


