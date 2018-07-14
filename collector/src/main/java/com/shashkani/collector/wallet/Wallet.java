package com.shashkani.collector.wallet;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.math.BigInteger;

@Data
@RedisHash("Wallet")
public class Wallet implements Serializable {

    @Id
    private String publicKey;
    private String address;
    private BigInteger amount;
}
