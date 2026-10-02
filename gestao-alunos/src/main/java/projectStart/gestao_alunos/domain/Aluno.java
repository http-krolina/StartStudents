package projectStart.gestao_alunos.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.validator.constraints.br.CPF;


@Entity
@Table(name = "aluno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aluno {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true, updatable = false, length = 20)
        private String matricula;

        @Column(nullable = false, length = 120)
        private String nome;

        @Column(nullable = false, unique = true, length = 150)
        private String email;


        @Column(nullable = false, unique = true, updatable = false, length = 11)
        private String cpf;

        @Column(nullable = false, length = 11)
        private String telefone;

        @Column(length = 255)
        private String foto;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 10)
        private StatusAluno status;
}
